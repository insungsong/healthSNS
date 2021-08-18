import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityMemberCreateInput {
  @Field()
  communityId: number;
}
