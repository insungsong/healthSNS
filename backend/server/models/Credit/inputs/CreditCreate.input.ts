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

export enum CreditReason {
  // SIGNUP = "최초 회원가입",
  // HELPYOUACCEPT = "헬프미 요청 수락",
  // SHAREINFO = "CREADIT_REASON정보 공유",
  // INVITES = "내가 초대한 유저 회원가입",
  SIGN_UP = "sign_up_reason",
  HELP_YOU_ACCEPT = "help_you_accept_reason",
  INVITE_USER_SIGN_UP = "invite_signup_reason",
}

export enum CreditValue {
  SIGN_UP_VALUE = 10,
  HELP_YOU_ACCEPT_VALUE = 1,
  INVITE_USER_SIGN_UP_VALUE = 1,
  // SHAREINFO = 1,
  // INVITE = 1,
}

@InputType()
export class CreditCreateInput {
  @Field()
  reason: CreditReason;

  @Field()
  score: CreditValue;
}
