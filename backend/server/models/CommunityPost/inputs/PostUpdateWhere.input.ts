import { Field, InputType } from "type-graphql";

@InputType()
export class PostUpdateWhereInput {
  @Field()
  communityPostId: number;
}
