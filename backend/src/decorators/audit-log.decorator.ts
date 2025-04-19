import { SetMetadata } from '@nestjs/common';

export const AuditLog = (value: string) => SetMetadata('auditLog', value);
