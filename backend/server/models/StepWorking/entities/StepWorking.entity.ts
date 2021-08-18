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

@Entity()
export class StepWorkingEnity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.stepWorking,
    { cascade: true, onDelete: "CASCADE" }
  )
  user: UserEntity;

  @Column()
  stepCount: number;

  @Column()
  createdDate: Date;
}
