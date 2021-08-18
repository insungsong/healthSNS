/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.entities
 */

import { CreditEntity } from "../../Credit/entities/Credit.entity";
import { PointEntity } from "../../Point/entities/Point.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { CommunityEntity } from "../../Community/entities/Community.entity";
import { CommunityMemberEntity } from "../../CommunityMember/entities/CommunityMember.entity";
import { NotificationEntity } from "../../Notification/entities/Notification.entity";
import { CommunityPostCommentEntity } from "../../CommunityPostComment/entities/CommunityPostComment.entity";
import { StepWorkingEnity } from "../../StepWorking/entities/StepWorking.entity";
import { CommunityPostEntity } from "../../CommunityPost/entities/CommunityPost.entity";

/**
 * 데이터베이스와 연결된 Entity 입니다.
 *
 * @author BounceCode, Inc.
 */
export enum AlarmStatus {
  NULL = "null",
  SOUND = "sound",
  VIBRATION = "vibration",
  SLIENT = "slient",
}

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  mrloginId: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profile: string;

  @OneToMany(
    (type) => PointEntity,
    (point) => point.user,
    { nullable: true }
  )
  point: PointEntity;

  @OneToMany(
    (type) => CreditEntity,
    (credit) => credit.user,
    { nullable: true }
  )
  credit: CreditEntity;

  // @ManyToMany(
  //   (type) => CommunityEntity,
  //   (community) => community.user
  // )
  // community: CommunityEntity;

  // @ManyToMany(
  //   (type) => CommunityMemberEntity,
  //   (communityMemeber) => communityMemeber.user,
  //   { nullable: true }
  // )
  // @JoinTable()
  // communityMember: CommunityMemberEntity[];

  @OneToMany(
    (type) => CommunityMemberEntity,
    (communityMemeber) => communityMemeber.user,
    { nullable: true }
  )
  communityMember: CommunityMemberEntity[];

  @OneToMany(
    (type) => NotificationEntity,
    (notification) => notification.user,
    { nullable: true }
  )
  notification: NotificationEntity;

  @OneToMany(
    (type) => CommunityPostEntity,
    (communityPost) => communityPost.user
  )
  post: CommunityPostEntity;

  @OneToMany(
    (type) => CommunityPostCommentEntity,
    (comment) => comment.user,
    { nullable: true }
  )
  comment: CommunityPostCommentEntity;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: 0 })
  pointScore?: number;

  @Column({ default: 0 })
  creditScore: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthYear: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: AlarmStatus,
  })
  alarmStatus: AlarmStatus;

  @ManyToMany(
    (type) => UserEntity,
    (user) => user.behelpedYou,
    { nullable: true }
  )
  @JoinTable({ name: "helpyou_behelpedyou" })
  helpYou: UserEntity[];

  @ManyToMany(
    (type) => UserEntity,
    (user) => user.helpYou,
    { nullable: true }
  )
  behelpedYou: UserEntity[];

  // @OneToMany(
  //   (type) => BlockUserEntity,
  //   (blockUser) => blockUser.blockedUser,
  //   { nullable: true }
  // )
  // blocker: BlockUserEntity;

  @Column({ nullable: true })
  invitedMe: number;

  @Column({ default: false })
  isInvite: boolean;

  @OneToMany(
    (type) => StepWorkingEnity,
    (stepWorking) => stepWorking.user,
    { nullable: true }
  )
  stepWorking: StepWorkingEnity;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
