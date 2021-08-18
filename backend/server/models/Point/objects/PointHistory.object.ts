import {Field, ObjectType} from 'type-graphql';
import {PointReason} from '../entities/Point.entity';

@ObjectType()
export class PointHistoryObject {
  @Field({nullable: true})
  id: number;

  @Field({nullable: true})
  reason: PointReason;

  @Field({nullable: true})
  pointScore: number;

  @Field({nullable: true})
  createdDate: Date;
}
