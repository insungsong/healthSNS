import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityUpdateWhereInput {
  @Field()
  communityId: number;
}
