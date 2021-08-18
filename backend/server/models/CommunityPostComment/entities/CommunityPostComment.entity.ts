import { CommunityPostEntity } from "../../CommunityPost/entities/CommunityPost.entity";
import { UserEntity } from "../../User/entities/User.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NotificationEntity } from "../../Notification/entities/Notification.entity";

@Entity()
export class CommunityPostCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => CommunityPostEntity,
    (communityPost) => communityPost.comment,
    { cascade: true, onDelete: "CASCADE" }
  )
  communityPost: CommunityPostEntity;

  @Column()
  content: string;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.comment,
    { cascade: true, onDelete: "CASCADE" }
  )
  user: UserEntity;

  @OneToMany(
    (type) => NotificationEntity,
    (notification) => notification.communityPostComment
  )
  notification: NotificationEntity;

  @Column({ default: true })
  isVisble: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
