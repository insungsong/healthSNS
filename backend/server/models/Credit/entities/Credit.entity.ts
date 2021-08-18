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

export enum CreditReason {
  SIGN_UP = "sign_up_reason",
  HELP_YOU_ACCEPT = "help_you_accept_reason",
  INVITE_USER_SIGN_UP = "invite_signup_reason",
}
export enum CreditValue {
  SIGN_UP_VALUE = 10,
  HELP_YOU_ACCEPT_VALUE = 2,
  INVITE_USER_SIGN_UP_VALUE = 1,
}

@Entity()
export class CreditEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.credit,
    { cascade: true, onDelete: "CASCADE" }
  )
  user: UserEntity;

  @Column({
    type: "enum",
    enum: CreditReason,
    nullable: true,
    // default: CreditReason.HELP_YOU_ACCEPT,
  })
  reason: CreditReason;

  @Column({
    type: "enum",
    enum: CreditValue,
    nullable: true,
  })
  creditScore: CreditValue;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
