import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  registration: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ type: 'time', nullable: true })
  morningEntry: string;

  @Column({ type: 'time', nullable: true })
  morningExit: string;

  @Column({ type: 'time', nullable: true })
  afternoonEntry: string;

  @Column({ type: 'time', nullable: true })
  afternoonExit: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 