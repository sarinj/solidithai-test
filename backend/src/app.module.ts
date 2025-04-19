import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserModule } from './user/user.module';
import { Comment } from './entities/comment.entity';
import { CommentModule } from './comment/comment.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuditLogs } from './entities/audit_log.entity';
import { AuditLogger } from './interceptors/auditLogger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Comment, AuditLogs],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, AuditLogs]),
    AuthModule,
    UserModule,
    CommentModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogger,
    },
  ],
})
export class AppModule {}
