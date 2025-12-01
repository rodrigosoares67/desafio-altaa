import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { Role } from '@prisma/client';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InviteService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createInvite(senderId: string, companyId: string, dto: CreateInviteDto) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: senderId, companyId } },
    });

    if (!membership || (membership.role !== Role.OWNER && membership.role !== Role.ADMIN)) {
      throw new ForbiddenException('Apenas OWNER ou ADMIN podem convidar.');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias de validade

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException('Empresa não localizada');

    const invite = await this.prisma.invite.upsert({
      where: { token },
      create: {
        email: dto.email,
        role: dto.role,
        companyId,
        token,
        expiresAt,
      },
      update: {
        token,
        role: dto.role,
        expiresAt,
      },
    });
    
    await this.prisma.invite.deleteMany({
      where: { email: dto.email, companyId }
    });
    
    const newInvite = await this.prisma.invite.create({
      data: {
        email: dto.email,
        role: dto.role,
        companyId,
        token,
        expiresAt
      }
    });

    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;
    
    await this.emailService.sendInviteEmail(dto.email, company.name, dto.role, inviteLink);

    return invite;
  }

  async acceptInvite(dto: AcceptInviteDto) {
    const invite = await this.prisma.invite.findUnique({
      where: { token: dto.token },
    });

    if (!invite) throw new NotFoundException('Convite inválido');
    if (new Date() > invite.expiresAt) throw new BadRequestException('Convite expirado');

    let user = await this.prisma.user.findUnique({ where: { email: invite.email } });

    if (!user) {
      if (!dto.password || !dto.name) {
        throw new BadRequestException('Para novos usuários, nome e senha são obrigatórios.');
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user = await this.prisma.user.create({
        data: {
          email: invite.email,
          name: dto.name,
          password: hashedPassword,
        },
      });
    }

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        companyId: invite.companyId,
        role: invite.role,
      },
    });

    await this.prisma.invite.delete({ where: { id: invite.id } });

    return { message: 'Convite aceito! Faça login.' };
  }
}