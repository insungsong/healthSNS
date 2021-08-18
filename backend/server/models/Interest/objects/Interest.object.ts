import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InterestObject {
  @Field()
  title: string;
}
