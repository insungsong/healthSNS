import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityPostCommentCreateWhereInput {
  @Field()
  communityPost: number;
}
