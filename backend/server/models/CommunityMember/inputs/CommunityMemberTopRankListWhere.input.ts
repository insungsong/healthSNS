import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityMemberTopRankListWhereInput {
  @Field()
  communityId: number;
}
