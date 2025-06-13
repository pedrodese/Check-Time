import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(registration: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(registration, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(user: User) {
    const payload = { 
      sub: user.id, 
      registration: user.registration,
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        registration: user.registration,
        name: user.name,
        role: user.role,
      },
    };
  }
} 