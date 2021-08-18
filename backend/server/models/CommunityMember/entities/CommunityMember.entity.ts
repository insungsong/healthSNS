import { UserEntity } from "../../User/entities/User.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommunityEntity } from "../../Community/entities/Community.entity";

export enum CommunityMemberRank {
  MASTER = "master",
  MANAGER = "manager",
  USER = "user",
}

@Entity()
export class CommunityMemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.communityMember,
    { cascade: true, onDelete: "CASCADE" }
  )
  user: UserEntity;

  @ManyToOne(
    (type) => CommunityEntity,
    (community) => community.communityMember
  )
  community: CommunityEntity;

  @Column({ default: false })
  isApprove: boolean;

  @Column({
    type: "enum",
    enum: CommunityMemberRank,
    default: CommunityMemberRank.USER,
  })
  rank: CommunityMemberRank;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
