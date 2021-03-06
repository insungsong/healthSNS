/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.objects
 */

import { ObjectType, Field } from "type-graphql";

/**
 * {@link TokenResolver} 에서 반환되는 데이터를 확인하기위한 ObjectType 입니다.
 *
 * @author BounceCode, Inc.
 */
@ObjectType()
export class TokenObject {
  @Field()
  token: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expires_in: number;

  @Field()
  token_type: string;
}
