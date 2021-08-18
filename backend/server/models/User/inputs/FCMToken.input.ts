import { Field, InputType } from "type-graphql";

@InputType()
export class FCMTokenInput {
  @Field({ nullable: true })
  fcmToken?: string;

  @Field({ nullable: true })
  apnToken?: string;
}
