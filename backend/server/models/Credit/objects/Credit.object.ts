import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class CreditObject {
  @Field({nullable: true})
  id: number;

  @Field({nullable: true})
  creditCount: number;

  @Field({nullable: true})
  reason: string;

  @Field({nullable: true})
  creditScore: number;

  @Field({nullable: true})
  createdDate: Date;
}
