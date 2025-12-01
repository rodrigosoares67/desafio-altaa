import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        memberships: {
          create: {
            userId: userId,
            role: Role.OWNER,
          },
        },
      },
    });
  }

  async findAllUserCompanies(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        skip,
        take: limit,
        where: {
          memberships: { some: { userId } },
        },
        include: {
          memberships: {
            where: { userId },
            select: { role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({
        where: { memberships: { some: { userId } } },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async validateMembership(userId: string, companyId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Empresa não encontrada');

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Você não é membro desta empresa');
    }

    return membership;
  }

  async getMembers(companyId: string) {
    return this.prisma.membership.findMany({
      where: { companyId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async removeMember(requesterId: string, companyId: string, memberIdToRemove: string) {
    const requester = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });

    if (!requester) throw new ForbiddenException('Você não é membro desta empresa');

    const memberToRemove = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: memberIdToRemove, companyId } },
    });

    if (!memberToRemove) throw new BadRequestException('Membro não encontrado');

    if (requester.role === Role.ADMIN && memberToRemove.role !== Role.MEMBER) {
      throw new ForbiddenException('Administradores somente podem remover membros comuns.');
    }

    if (memberToRemove.role === Role.OWNER) {
      const ownersCount = await this.prisma.membership.count({
        where: { companyId, role: Role.OWNER },
      });
      
      if (ownersCount <= 1) {
        throw new BadRequestException('Não é possível remover o único OWNER da empresa.');
      }
    }

    return this.prisma.membership.delete({
      where: { userId_companyId: { userId: memberIdToRemove, companyId } },
    });
  }
}