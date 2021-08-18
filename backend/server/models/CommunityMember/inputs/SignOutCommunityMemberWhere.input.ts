import {Field, InputType} from 'type-graphql';

@InputType()
export class SignOutCommunityMemberWhereInput {
  @Field()
  communityMemberId?: number;
  @Field()
  communityId?: number;
}
