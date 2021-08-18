import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityInfoWhereInput {
  @Field()
  communityId: number;
}
