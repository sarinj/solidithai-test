import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogs } from 'src/entities/audit_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogs])],
  controllers: [AuditLogController],
  providers: [AuditLogService],
})
export class AuditLogModule {}
