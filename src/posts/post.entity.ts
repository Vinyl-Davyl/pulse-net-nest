import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user: User) => user.posts)
  user: User;

  @Column({ type: 'text', nullable: true })
  caption: string | null;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ name: 'file_type', type: 'varchar' })
  fileType: string;

  @Column({ name: 'file_name', type: 'varchar' })
  fileName: string;

  @Column({ name: 'imagekit_file_id', type: 'varchar', nullable: true })
  imagekitFileId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
