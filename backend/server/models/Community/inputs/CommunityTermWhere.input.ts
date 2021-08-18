import { Field, InputType } from "type-graphql";

@InputType()
export class CommunityTermWhereInput {
  @Field()
  term: string;
}
