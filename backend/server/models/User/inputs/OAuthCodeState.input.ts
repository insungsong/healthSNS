import { Field, InputType } from "type-graphql";

@InputType()
export class OAuthCodeStateInput {
  @Field()
  code: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  fcmToken?: string;
}
