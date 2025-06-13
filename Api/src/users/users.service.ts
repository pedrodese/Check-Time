import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByRegistration(createUserDto.registration);
    if (existingUser) {
      throw new ConflictException('Matrícula já cadastrada');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByRegistration(registration: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { registration } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'registration', 'name', 'role', 'createdAt', 'updatedAt'],
    });
  }

  async validateUser(registration: string, password: string): Promise<User | null> {
    const user = await this.findByRegistration(registration);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
} 