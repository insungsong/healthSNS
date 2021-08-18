import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PhoneNumberListObject {
  @Field()
  id: number;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  phoneName: string;

  @Field({ nullable: true })
  friendCount: number;
}
