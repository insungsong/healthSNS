import { CommunityEntity } from "../../Community/entities/Community.entity";
import { CommunityPostCommentEntity } from "../../CommunityPostComment/entities/CommunityPostComment.entity";
import { InterestEntity } from "../../Interest/entities/Interest.entity";

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NotificationEntity } from "../../Notification/entities/Notification.entity";
import { UserEntity } from "../../User/entities/User.entity";

enum PostCreateType {
  COMMUNITY = "community",
  ALL = "all",
}

@Entity()
export class CommunityPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.post,
    { cascade: true, onDelete: "CASCADE" }
  )
  user: UserEntity;

  @Column()
  content: string;

  @ManyToMany(
    (type) => InterestEntity,
    (interest) => interest.communityPost
  )
  @JoinTable({ name: "post_interest" })
  interest: InterestEntity[];

  @Column("text", { array: true, nullable: true })
  photo: string[];

  @Column({ nullable: true })
  link: string;

  @Column({
    type: "enum",
    enum: PostCreateType,
    default: PostCreateType.ALL,
  })
  disclosureRange: PostCreateType;

  @ManyToOne(
    (type) => CommunityEntity,
    (community) => community.communityPost
  )
  community: CommunityEntity;

  @OneToMany(
    (type) => CommunityPostCommentEntity,
    (comment) => comment.communityPost
    // {cascade: true, onDelete: 'CASCADE'},
  )
  comment: CommunityPostCommentEntity;

  @OneToMany(
    (type) => NotificationEntity,
    (notification) => notification.communityPost
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
