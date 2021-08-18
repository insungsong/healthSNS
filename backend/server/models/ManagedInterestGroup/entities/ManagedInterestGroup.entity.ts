import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ManagedInterestEntity } from "../../ManagedInterest/entities/ManagedInterest.entity";

@Entity()
export class ManagedInterestGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    (type) => ManagedInterestEntity,
    (managedInterest) => managedInterest.InterestGroup
  )
  managedInterest: ManagedInterestEntity;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
