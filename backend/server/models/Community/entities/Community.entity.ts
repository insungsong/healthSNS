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
import { CommunityMemberEntity } from "../../CommunityMember/entities/CommunityMember.entity";
import { NotificationEntity } from "../../Notification/entities/Notification.entity";

@Entity()
export class CommunityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToMany(
  //   (type) => UserEntity,
  //   (user) => user.community
  // )
  // user: UserEntity;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  description: string;

  @OneToMany(
    (type) => CommunityMemberEntity,
    (communityMember) => communityMember.community
  )
  communityMember: CommunityMemberEntity[];

  @OneToMany(
    (type) => CommunityPostEntity,
    (communityPost) => communityPost.community
  )
  communityPost: CommunityPostEntity;

  @OneToMany(
    (type) => NotificationEntity,
    (notification) => notification.community
  )
  notification: NotificationEntity;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: false })
  isClosed: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
