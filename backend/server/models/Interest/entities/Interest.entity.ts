import { CommunityPostEntity } from "../../CommunityPost/entities/CommunityPost.entity";
import { ManagedInterestEntity } from "../../ManagedInterest/entities/ManagedInterest.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ManagedInterestGroupEntity } from "../../ManagedInterestGroup/entities/ManagedInterestGroup.entity";

@Entity()
export class InterestEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  // @OneToOne(
  //   (type) => ManagedInterestEntity,
  //   (managedInterest) => managedInterest.interest
  // )
  // @JoinColumn()
  // managedInterest: ManagedInterestEntity;

  @ManyToMany(
    (type) => CommunityPostEntity,
    (communityPost) => communityPost.interest
  )
  communityPost: CommunityPostEntity[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
