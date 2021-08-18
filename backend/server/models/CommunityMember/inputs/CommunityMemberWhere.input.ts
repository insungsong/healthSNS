import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityMemberWhereInput {
  @Field()
  communityId: number;
}
