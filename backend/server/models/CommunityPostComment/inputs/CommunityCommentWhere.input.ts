import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityCommentWhereInput {
  @Field()
  communityPostId: number;
}
