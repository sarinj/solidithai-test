import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuditLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  target: string;

  @Column({ type: 'json' })
  content: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.auditLogs)
  user: User;
}
