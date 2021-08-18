import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityPostCommentCreateDataInput {
  @Field()
  content: string;
}
