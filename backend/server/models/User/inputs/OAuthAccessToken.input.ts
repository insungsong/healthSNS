import { Field, InputType } from "type-graphql";

@InputType()
export class OAuthAccessTokenInput {
  @Field()
  accessToken: string;

  // @Field({ nullable: true })
  // fcmToken?: string;
}
