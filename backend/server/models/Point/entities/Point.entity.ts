import { UserEntity } from "../../User/entities/User.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum PointReason {
  WORKING = "working",
  INFORMATION = "information",
  REINFORMATION = "reinformation",
  SHAREINFORMATION_SUBSCRIPTION_COUNT = "shareinformation_subscription_count",
}

@Entity()
export class PointEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.point,
    { cascade: true, onDelete: "CASCADE" }
  )
  user: UserEntity;

  @Column({
    type: "enum",
    enum: PointReason,
    nullable: true,
  })
  reason: PointReason;

  @Column()
  pointScore: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
