import { InterestEntity } from "../../Interest/entities/Interest.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ManagedInterestGroupEntity } from "../../ManagedInterestGroup/entities/ManagedInterestGroup.entity";

@Entity()
export class ManagedInterestEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => ManagedInterestGroupEntity,
    (managedInterestGroup) => managedInterestGroup.managedInterest,
    { cascade: true, onDelete: "CASCADE" }
  )
  InterestGroup: ManagedInterestGroupEntity;

  @Column()
  title: string;

  // @OneToOne(
  //   (type) => InterestEntity,
  //   (interest) => interest.managedInterest
  // )
  // interest: InterestEntity;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
