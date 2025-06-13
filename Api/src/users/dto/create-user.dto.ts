import { IsString, IsNotEmpty, MinLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'A matrícula deve conter exatamente 6 dígitos' })
  registration: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de horário inválido (HH:mm)' })
  morningEntry: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de horário inválido (HH:mm)' })
  morningExit: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de horário inválido (HH:mm)' })
  afternoonEntry: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de horário inválido (HH:mm)' })
  afternoonExit: string;
} 