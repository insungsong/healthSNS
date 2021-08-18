import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityClosingUpdateInput {
  @Field()
  isClosed: boolean;
}
