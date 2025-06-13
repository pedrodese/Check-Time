import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeRecordsService } from './time-records.service';
import { TimeRecordsController } from './time-records.controller';
import { TimeRecord } from './entities/time-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRecord])],
  controllers: [TimeRecordsController],
  providers: [TimeRecordsService],
  exports: [TimeRecordsService],
})
export class TimeRecordsModule {} 