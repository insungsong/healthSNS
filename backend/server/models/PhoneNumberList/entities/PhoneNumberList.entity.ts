import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class PhoneNumberListEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //초대한 userId
  @Column()
  userId: number;

  @Column()
  phoneNumber: string;

  @Column()
  phoneName: string;

  @Column({ default: false })
  isInvited: boolean;

  @Column({ nullable: true })
  friendCount: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
