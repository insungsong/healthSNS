/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.objects
 */
import {ObjectType, Field, ID} from 'type-graphql';
import {UserObject} from '../../User/objects/User.object';

/**
 * {@link UserResolver} 에서 반환되는 데이터를 확인하기위한 ObjectType 입니다.
 *
 * @author BounceCode, Inc.
 */

@ObjectType()
export class CommunityItemObject {
  @Field()
  id: number;

  @Field({nullable: true})
  title: string;

  @Field({nullable: true})
  image: string;

  @Field({nullable: true})
  description: string;

  @Field({nullable: true})
  isClosed: Boolean;
}

@ObjectType()
export class IsCommunityMemberObject {
  @Field({nullable: true})
  check: string;
  @Field({nullable: true})
  isApprove?: Boolean;
}
@ObjectType()
class RequestRankMemberObject {
  @Field()
  id: number;

  @Field()
  rank: string;
}

@ObjectType()
export class CommunityObject {
  @Field(type => CommunityItemObject)
  communityItem: CommunityItemObject;

  @Field(type => IsCommunityMemberObject)
  isCommunityMember: IsCommunityMemberObject;

  @Field(type => [UserObject], {nullable: true})
  user: UserObject[];

  @Field(type => [RequestRankMemberObject])
  requestInfo: RequestRankMemberObject[];
}

@ObjectType()
export class CommunityListObject {
  @Field()
  id: number;

  @Field()
  community: CommunityItemObject;
}
