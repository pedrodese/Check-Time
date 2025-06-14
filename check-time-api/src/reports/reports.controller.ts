import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('generate')
  @Roles(UserRole.ADMIN)
  async generateReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const { fileName, filePath } = await this.reportsService.generateReport(
      new Date(startDate),
      new Date(endDate),
    );

    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao baixar o arquivo' });
      }
    });
  }
} 