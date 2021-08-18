/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.inputs
 */

import { Field, InputType } from "type-graphql";
import GraphQLJSON from "graphql-type-json";

/**
 * {@link UserResolver} 에서 입력된 데이터를 확인하기위한 InputType 입니다.
 *
 * @author BounceCode, Inc.
 */

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  profile: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  gender: string;

  @Field()
  birthYear: string;

  @Field({ nullable: true })
  description: String;

  @Field({ nullable: true })
  phoneNumber: string;
}
