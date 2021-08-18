import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

enum ReportCategory {
  SPAM = "spam",
  IMPERSONATE = "impersonate",
  HAZARDOUSCONTENT = "Hazardous_content",
  ETC = "etc",
}

enum Type {
  POST = "post",
  COMMENT = "comment",
}

@Entity()
export class ReportEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ReportCategory,
  })
  category: ReportCategory;

  @Column({
    type: "enum",
    enum: Type,
  })
  type: Type;

  @Column()
  email: string;

  @Column()
  reporter: number;

  @Column()
  reported: number;

  @Column({ default: null })
  communityPostId: number;

  @Column({ default: null })
  communityPostCommentId: number;

  @Column()
  description: string;

  @Column({ default: false })
  blockingStatus: boolean;

  @Column({ default: false })
  isChecked: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
