import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { getClientIp } from 'request-ip';
import { Observable, tap } from 'rxjs';
import { User } from 'src/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AuditLogs } from 'src/entities/audit_log.entity';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/constant';

@Injectable()
export class AuditLogger implements NestInterceptor {
  logger = new Logger(AuditLogger.name);

  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AuditLogs)
    private auditLogsRepository: Repository<AuditLogs>,
  ) {}

  // Helper function to parse cookies
  private parseCookies(cookieHeader: string): { [key: string]: string } {
    const cookies = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      cookies[key] = value;
    });

    return cookies;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditLog = this.reflector.get<string>(
      'auditLog',
      context.getHandler(),
    );

    return next.handle().pipe(
      tap(async (response) => {
        if (!auditLog) return;

        const request = context.switchToHttp().getRequest();
        const ip = getClientIp(request);

        const cookieHeader = request.headers['cookie'];
        let userEntity = null;

        if (cookieHeader) {
          try {
            const cookies = this.parseCookies(cookieHeader);

            const jwtToken = cookies['act'];

            if (jwtToken) {
              const decoded = jwt.verify(jwtToken, JWT_SECRET) as any;

              if (decoded && decoded.sub.id) {
                userEntity = await this.userRepository.findOneBy({
                  id: decoded.sub.id,
                });
              }
            }
          } catch (error) {
            this.logger.error(`Error decoding JWT: ${error.message}`);
          }
        }

        const data: QueryDeepPartialEntity<AuditLogs> = {
          action: auditLog,
          target: request.url.split('?')[0],
          content: {
            ip: ip,
            method: request.method,
            query: request.query,
            params: request.params,
            body: request.body,
            // headers: request.headers,
            // response: response,
          },
          user: userEntity,
        };

        await this.auditLogsRepository.manager.transaction(
          async (transaction) => {
            await transaction.save(AuditLogs, data as DeepPartial<AuditLogs>);
          },
        );
      }),
    );
  }
}
