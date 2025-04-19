import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from 'src/decorators/audit-log.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @AuditLog('getAuditLogs')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAuditLogs(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    const offset = (pageNumber - 1) * pageSizeNumber;

    const { auditLogs, total } = await this.auditLogService.find(
      search,
      offset,
      pageSizeNumber,
    );

    return {
      auditLogs,
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalPages: Math.ceil(total / pageSizeNumber),
      total: total,
    };
  }
}
