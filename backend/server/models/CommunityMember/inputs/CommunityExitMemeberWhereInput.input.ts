import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityExitMemeberWhereInput {
  @Field()
  communityMemberId: number;
}
