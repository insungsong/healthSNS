import {UserObject} from '../../User/objects/User.object';
import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class PointObject {
  @Field({nullable: true})
  mrloginId: number;

  @Field({nullable: true})
  profile: string;

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  pointScore: number;

  @Field({nullable: true})
  creditCount: number;

  @Field({nullable: true})
  description: string;

  @Field({nullable: true})
  birthYear: string;

  @Field({nullable: true})
  gender: string;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;

  @Field({nullable: true})
  deletedDate: Date;
}
