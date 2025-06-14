import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  registration?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  morningEntry?: string;

  @IsString()
  @IsOptional()
  morningExit?: string;

  @IsString()
  @IsOptional()
  afternoonEntry?: string;

  @IsString()
  @IsOptional()
  afternoonExit?: string;
} 