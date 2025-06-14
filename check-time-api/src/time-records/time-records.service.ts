import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeRecord, RecordType } from './entities/time-record.entity';
import { CreateTimeRecordDto } from './dto/create-time-record.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TimeRecordsService {
  constructor(
    @InjectRepository(TimeRecord)
    private timeRecordsRepository: Repository<TimeRecord>,
  ) {}

  private isWithinTimeWindow(time: string, windowStart: number, windowEnd: number): boolean {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    return timeInMinutes >= windowStart && timeInMinutes <= windowEnd;
  }

  private getTimeWindow(type: RecordType): { start: number; end: number } {
    const windows = {
      [RecordType.MORNING_ENTRY]: { start: 7 * 60 + 45, end: 8 * 60 + 15 }, // 07:45 - 08:15
      [RecordType.MORNING_EXIT]: { start: 11 * 60 + 45, end: 12 * 60 + 15 }, // 11:45 - 12:15
      [RecordType.AFTERNOON_ENTRY]: { start: 13 * 60 + 45, end: 14 * 60 + 15 }, // 13:45 - 14:15
      [RecordType.AFTERNOON_EXIT]: { start: 17 * 60 + 45, end: 18 * 60 + 15 }, // 17:45 - 18:15
    };
    return windows[type];
  }

  async create(user: User, createTimeRecordDto: CreateTimeRecordDto): Promise<TimeRecord> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Verificar se já existe registro do mesmo tipo no mesmo dia
    const existingRecord = await this.timeRecordsRepository.findOne({
      where: {
        userId: user.id,
        type: createTimeRecordDto.type,
        date: new Date(today),
      },
    });

    if (existingRecord) {
      throw new ConflictException('Já existe um registro deste tipo para hoje');
    }

    // // Verificar se está dentro da janela de horário permitida
    // const window = this.getTimeWindow(createTimeRecordDto.type);
    // if (!this.isWithinTimeWindow(currentTime, window.start, window.end)) {
    //   throw new BadRequestException('Fora da janela de horário permitida');
    // }

    const timeRecord = this.timeRecordsRepository.create({
      userId: user.id,
      type: createTimeRecordDto.type,
      date: new Date(today),
      time: currentTime,
    });

    return this.timeRecordsRepository.save(timeRecord);
  }

  async findByUserAndDate(userId: string, date: string): Promise<TimeRecord[]> {
    return this.timeRecordsRepository.find({
      where: { 
        userId, 
        date: new Date(date) 
      },
      order: { time: 'ASC' },
    });
  }

  async findAllByDate(date: string): Promise<TimeRecord[]> {
    return this.timeRecordsRepository.find({
      where: { 
        date: new Date(date) 
      },
      relations: ['user'],
      order: { time: 'ASC' },
    });
  }
} 