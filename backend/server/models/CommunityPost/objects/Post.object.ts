import { CommunityItemObject } from "../../Community/objects/Community.object";
import { InterestObject } from "../../Interest/objects/Interest.object";
import { UserObject } from "../../User/objects/User.object";
import { Field, ObjectType } from "type-graphql";
import { CommunityPostCommentObject } from "../../CommunityPostComment/objects/CommunityPostComment.object";

enum PostCreateType {
  COMMUNITY = "community",
  ALL = "all",
}
@ObjectType()
class PostDetailInfoObject {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  photo: string;

  @Field()
  link: string;

  @Field()
  isVisble: true;

  @Field((type) => [InterestObject])
  interest: InterestObject[];
}
@ObjectType()
export class PostDetailObject {
  @Field()
  communityPost: PostDetailInfoObject;

  @Field()
  user: UserObject;
}

@ObjectType()
export class PostObject {
  @Field()
  id: number;

  @Field({ nullable: true })
  community: CommunityItemObject;

  @Field((type) => [CommunityPostCommentObject], { nullable: true })
  comment: CommunityPostCommentObject[];

  @Field()
  user: UserObject;

  @Field({ nullable: true })
  content: string;

  @Field((type) => [String], { nullable: true })
  photo: string[];

  @Field({ nullable: true })
  link: string;

  // @Field({ defaultValue: 0 })
  // @Field({ nullable: true })
  // disclosureRange: number;

  @Field({ defaultValue: PostCreateType.ALL })
  disclosureRange: PostCreateType;

  @Field()
  isVisble: boolean;

  @Field()
  createdDate: Date;

  @Field((type) => [InterestObject], { nullable: true })
  interest: InterestObject[];
}

@ObjectType()
export class PostAndInterestMergeObject {
  @Field()
  postObject: PostObject;

  @Field((type) => [String])
  interest: string[];
}

@ObjectType()
class CommunityCategoryObject {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field()
  description: string;

  @Field()
  isVisible: true;

  @Field()
  isClosed: false;
}
@ObjectType()
export class PostCategoryObect {
  @Field()
  community: CommunityCategoryObject;
}
