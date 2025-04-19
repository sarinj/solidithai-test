import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogs } from 'src/entities/audit_log.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogs) private repo: Repository<AuditLogs>,
  ) {}

  async find(search: string, offset: number, limit: number) {
    const [auditLogs, total] = await this.repo.findAndCount({
      where: search
        ? [{ action: Like(`%${search}%`) }, { target: Like(`%${search}%`) }]
        : {},
      skip: offset,
      take: limit,
      relations: {
        user: true,
      },
    });
    return { auditLogs, total };
  }
}
