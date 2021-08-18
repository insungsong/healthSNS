import {Field, InputType} from 'type-graphql';

@InputType()
export class CommunityIsRankWhereInput {
  @Field()
  communityId?: number;
}
