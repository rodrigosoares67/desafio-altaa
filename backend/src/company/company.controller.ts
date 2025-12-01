import { Controller, Get, Post, Body, UseGuards, Req, Query, DefaultValuePipe, ParseIntPipe, HttpCode, Param, Res, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthService } from '../auth/auth.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiTags, ApiOperation, ApiCookieAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';

@ApiTags('Company')
@ApiCookieAuth('Authentication')
@UseGuards(JwtAuthGuard)
@Controller()
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService
  ) {}

  @Get('company/:id')
  @ApiOperation({ summary: 'Busca detalhes de uma empresa' })
  async findOne(@Param('id') id: string, @Req() req) {
    await this.companyService.validateMembership(req.user.userId, id);
    return this.companyService.findOne(id);
  }

  @Post('company')
  @ApiOperation({ summary: 'Cria nova empresa e torna usuário OWNER' })
  create(@Req() req, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(req.user.userId, createCompanyDto);
  }

  @Get('companies')
  @ApiOperation({ summary: 'Lista empresas do usuário com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.companyService.findAllUserCompanies(req.user.userId, page, limit);
  }

  @Post('company/:id/select')
  @HttpCode(200)
  @ApiOperation({ summary: 'Define a empresa ativa na sessão' })
  @ApiResponse({ status: 200, description: 'Contexto trocado com sucesso' })
  @ApiResponse({ status: 403, description: 'Usuário não é membro desta empresa' })
  async selectCompany(
    @Param('id') id: string, 
    @Req() req, 
    @Res({ passthrough: true }) response: Response
  ) {
    await this.companyService.validateMembership(req.user.userId, id);

    const result = await this.authService.switchCompany(req.user.userId, id);

    response.cookie('Authentication', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { 
      message: 'Empresa selecionada com sucesso', 
      user: result.user 
    };
  }

  @Get('company/:id/members')
  @ApiOperation({ summary: 'Lista membros da empresa' })
  async getMembers(@Param('id') id: string, @Req() req) {
    await this.companyService.validateMembership(req.user.userId, id);
    return this.companyService.getMembers(id);
  }

  @Delete('company/:id/members/:memberId')
  @ApiOperation({ summary: 'Remove um membro da empresa' })
  async removeMember(
    @Param('id') companyId: string,
    @Param('memberId') memberId: string,
    @Req() req
  ) {
    return this.companyService.removeMember(req.user.userId, companyId, memberId);
  }
}