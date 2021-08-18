import { Field, InputType } from "type-graphql";

enum Type {
  COMMUNITY = "community",
  POST = "post",
}
@InputType()
export class PostDeleteWhereInput {
  @Field({ nullable: true })
  communityPostId: number;

  @Field()
  type: Type;
}
