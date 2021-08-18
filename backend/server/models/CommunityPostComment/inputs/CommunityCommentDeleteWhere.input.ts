import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityCommentDeleteWhereInput {
  @Field()
  communityPostCommentId: number;
}
