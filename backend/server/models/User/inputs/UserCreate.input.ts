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
export class UserCreateInput {
  @Field()
  mrloginId: number;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field()
  gender: string;

  @Field()
  birthYear: string;
}
