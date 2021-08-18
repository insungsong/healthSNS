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
export class HelpYouUpdateWhereInput {
  @Field()
  id: number;

  //false: helpyou를 함, true: helpyou가 되어있음으로 helpYou 취소
  @Field()
  isHelpYou: boolean;
}
