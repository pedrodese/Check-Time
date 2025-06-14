import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RecordType {
  MORNING_ENTRY = 'MORNING_ENTRY',
  MORNING_EXIT = 'MORNING_EXIT',
  AFTERNOON_ENTRY = 'AFTERNOON_ENTRY',
  AFTERNOON_EXIT = 'AFTERNOON_EXIT',
}

@Entity()
export class TimeRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: RecordType,
  })
  type: RecordType;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  time: string;

  @CreateDateColumn()
  createdAt: Date;
} 