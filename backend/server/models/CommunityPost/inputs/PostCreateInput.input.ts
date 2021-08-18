import { Field, InputType } from "type-graphql";

@InputType()
export class PostCreateInput {
  @Field((type) => [String], { nullable: true })
  interest: string[];

  @Field()
  content: string;

  @Field((type) => [String], { nullable: true })
  photo: string[];

  @Field({ nullable: true })
  link: string;
}
