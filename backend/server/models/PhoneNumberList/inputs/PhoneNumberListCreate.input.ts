import { Field, InputType } from "type-graphql";

@InputType()
export class PhoneNumberListDataInput {
  @Field()
  phoneNumber: string;

  @Field()
  phoneName: string;
}

@InputType()
export class PhoneNumberListCreateInput {
  // @Field((type) => [String], { nullable: true })
  @Field((type) => [PhoneNumberListDataInput])
  phoneNumberInfo?: PhoneNumberListDataInput[];
}
