import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeRecord } from '../time-records/entities/time-record.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRecord])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {} 