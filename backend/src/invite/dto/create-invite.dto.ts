import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInviteDto {
  @ApiProperty({ example: 'colaborador@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role, example: Role.MEMBER })
  @IsEnum(Role)
  role: Role;
}