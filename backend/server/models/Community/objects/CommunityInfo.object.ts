/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.objects
 */
import { CommunityMemberObject } from "../../CommunityMember/objects/CommunityMember.object";
import { ObjectType, Field, ID } from "type-graphql";
import { UserObject } from "../../User/objects/User.object";

/**
 * {@link UserResolver} 에서 반환되는 데이터를 확인하기위한 ObjectType 입니다.
 *
 * @author BounceCode, Inc.
 */

@ObjectType()
export class CommunityInfoObject {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  image: string;

  @Field()
  description: string;

  @Field()
  isVisible: boolean;

  @Field()
  isClosed: boolean;

  @Field((type) => [CommunityMemberObject])
  communityMember: CommunityMemberObject[];
}
