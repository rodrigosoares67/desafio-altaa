import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Invite')
@Controller()
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('company/:id/invite')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('Authentication')
  @ApiOperation({ summary: 'Convida um usuário por e-mail' })
  async invite(
    @Param('id') companyId: string,
    @Body() dto: CreateInviteDto,
    @Req() req,
  ) {
    return this.inviteService.createInvite(req.user.userId, companyId, dto);
  }

  @Post('auth/accept-invite')
  @ApiOperation({ summary: 'Aceita convite e associa usuário' })
  async accept(@Body() dto: AcceptInviteDto) {
    return this.inviteService.acceptInvite(dto);
  }
}