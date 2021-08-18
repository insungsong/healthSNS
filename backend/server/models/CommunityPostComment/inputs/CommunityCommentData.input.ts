import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityCommentInput {
  @Field()
  content: string;
}
