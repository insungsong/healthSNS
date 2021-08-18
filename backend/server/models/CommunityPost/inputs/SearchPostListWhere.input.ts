import { Field, InputType } from "type-graphql";

@InputType()
export class SearchInformationPostListWhereInput {
  @Field()
  term: string;
}
