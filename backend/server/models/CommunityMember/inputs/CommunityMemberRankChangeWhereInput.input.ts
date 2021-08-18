import { Field, InputType } from "type-graphql";

enum RankType {
  MANAGER = "manager",
  USER = "user",
}

@InputType()
export class CommunityMemberRankChangeWhereInput {
  @Field()
  communityId: number;

  @Field()
  communityMemberId: number;

  @Field()
  rank: RankType;
}
