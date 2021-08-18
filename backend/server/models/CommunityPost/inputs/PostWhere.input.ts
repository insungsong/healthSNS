import { Field, InputType } from "type-graphql";

@InputType()
export class PostWhereInput {
  @Field()
  postId: number;
}
