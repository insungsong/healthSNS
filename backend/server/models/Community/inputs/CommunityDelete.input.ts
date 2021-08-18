import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityDeleteInput {
  @Field()
  communityId: number;
}
