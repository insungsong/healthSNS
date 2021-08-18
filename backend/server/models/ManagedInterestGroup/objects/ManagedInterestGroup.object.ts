import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ManagedInterestObject {
  @Field()
  id: number;

  @Field()
  title: string;
}
@ObjectType()
export class ManagedInterestGroupObject {
  @Field()
  title: string;

  @Field((type) => [ManagedInterestObject])
  managedInterest: ManagedInterestObject[];
}
