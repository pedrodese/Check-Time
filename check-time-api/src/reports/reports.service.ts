import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeRecord } from '../time-records/entities/time-record.entity';
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(TimeRecord)
    private timeRecordRepository: Repository<TimeRecord>,
  ) {}

  async generateReport(startDate: Date, endDate: Date) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const records = await this.timeRecordRepository.find({
      where: {
        date: Between(startDate, end),
      },
      relations: ['user'],
      order: {
        createdAt: 'ASC',
      },
    });

    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    const fileName = `report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.csv`;
    const filePath = path.join(reportDir, fileName);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'employeeName', title: 'Nome do Funcionário' },
        { id: 'type', title: 'Tipo de Registro' },
        { id: 'date', title: 'Data' },
        { id: 'time', title: 'Hora' },
        { id: 'createdAt', title: 'Data/Hora de Registro' },
      ],
    });

    const recordsToWrite = records.map(record => ({
      employeeName: record.user.name,
      type: record.type,
      date: new Date(record.date).toLocaleDateString('pt-BR'),
      time: record.time,
      createdAt: record.createdAt.toLocaleString('pt-BR'),
    }));

    await csvWriter.writeRecords(recordsToWrite);

    return {
      fileName,
      filePath,
    };
  }
} 