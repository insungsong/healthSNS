import { Field, InputType } from "type-graphql";

@InputType()
export class PhoneNumberListWhereInput {
  // @Field((type) => [String], { nullable: true })
  @Field()
  phoneName: string;
}
