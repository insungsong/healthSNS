import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  image: string;

  @Field()
  description: string;
}
