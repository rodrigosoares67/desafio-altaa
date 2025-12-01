import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'ALTAA' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://altaa.com.br/wp-content/uploads/2023/01/altaa_logo_preta-1024x576.png', required: false })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}