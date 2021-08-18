import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PostsWhereInput {
  @Field({ nullable: true })
  interest: string;

  @Field({ nullable: true })
  communityId: number;

  @Field((type) => [Number], { nullable: true })
  blockUserList?: number[];
}
