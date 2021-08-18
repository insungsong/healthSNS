import {UserObject} from '../../User/objects/User.object';
import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class CommunityPostCommentObject {
  @Field()
  id: number;

  @Field()
  content: string;

  @Field()
  isVisble: boolean;

  @Field()
  communityPost: string;

  @Field()
  user: UserObject;

  @Field()
  createdDate: Date;
}
