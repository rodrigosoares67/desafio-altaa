import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
  @ApiProperty({ description: 'Token recebido por email' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'Nome do Usuário', required: false })
  @IsString()
  name: string;

  @ApiProperty({ example: 'novaSenha@123', required: false })
  @IsString()
  @MinLength(6)
  password: string;
}