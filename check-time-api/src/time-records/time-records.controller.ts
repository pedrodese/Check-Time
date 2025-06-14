import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { TimeRecordsService } from './time-records.service';
import { CreateTimeRecordDto } from './dto/create-time-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('time-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeRecordsController {
  constructor(private readonly timeRecordsService: TimeRecordsService) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  create(@Request() req, @Body() createTimeRecordDto: CreateTimeRecordDto) {
    return this.timeRecordsService.create(req.user, createTimeRecordDto);
  }

  @Get('my-records')
  @Roles(UserRole.EMPLOYEE)
  findMyRecords(@Request() req, @Query('date') date: string) {
    return this.timeRecordsService.findByUserAndDate(req.user.id, date);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('date') date: string) {
    return this.timeRecordsService.findAllByDate(date);
  }
} 