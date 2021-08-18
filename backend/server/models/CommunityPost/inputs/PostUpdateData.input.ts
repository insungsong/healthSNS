import { Field, InputType } from "type-graphql";

@InputType()
export class PostUpdateDataInput {
  @Field((type) => [String], { nullable: true })
  interest: string[];

  @Field({ nullable: true })
  content: string;

  @Field((type) => [String], { nullable: true })
  photo: string[];

  @Field({ nullable: true })
  link: string;
}
