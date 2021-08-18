/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.objects
 */

import { ObjectType, Field, ID } from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserObject } from "../../User/objects/User.object";

/**
 * {@link UserResolver} 에서 반환되는 데이터를 확인하기위한 ObjectType 입니다.
 *
 * @author BounceCode, Inc.
 */

@ObjectType()
export class CommunityMemberListInfoObject {
  @Field()
  id: number;

  @Field((type) => UserObject)
  user: UserObject;
}
@ObjectType()
export class CommunityMemberObject {
  @Field()
  id: number;

  @Field()
  rank: string;

  @Field((type) => UserObject)
  user: UserObject[];
}
