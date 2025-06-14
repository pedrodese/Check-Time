import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'A matrícula deve conter exatamente 6 dígitos' })
  registration: string;

  @IsString()
  @IsNotEmpty()
  password: string;
} 