import { IsEnum } from 'class-validator';
import { RecordType } from '../entities/time-record.entity';

export class CreateTimeRecordDto {
  @IsEnum(RecordType)
  type: RecordType;
} 