/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.objects
 */

import { ObjectType, Field, ID } from "type-graphql";
import GraphQLJSON from "graphql-type-json";

/**
 * {@link UserResolver} 에서 반환되는 데이터를 확인하기위한 ObjectType 입니다.
 *
 * @author BounceCode, Inc.
 */

@ObjectType()
class RankUserObject {
  @Field()
  mrloginId: number;
}
@ObjectType()
export class CommunityMemberTopRankObject {
  @Field()
  id: number;

  @Field()
  rank: string;

  @Field()
  user: RankUserObject;
}
