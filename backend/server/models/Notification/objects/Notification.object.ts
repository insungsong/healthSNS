import {CommunityListObject} from '../../Community/objects/Community.object';
import {PostObject} from '../../CommunityPost/objects/Post.object';
import {CommunityPostCommentObject} from '../../CommunityPostComment/objects/CommunityPostComment.object';
import {UserObject} from '../../User/objects/User.object';
import {Field, ObjectType} from 'type-graphql';

enum NOTIFICATION_CATEGORY {
  ALL = 'all',
  COMMUNITY_REQUEST = 'community_request', //커뮤니티 요청했을때 (1:1 커뮤니티 관리자에게 전달)
  COMMUNITY_APPROVE = 'community_approve', //커뮤니티 승인했을때 (1:1 커뮤니티 요청자에게 전달)
  COMMUNITY_POST_AUTHOR_USER_COMMENT = 'community_post_author_user_comment', //내가 올린 글에 유저가 댓글을 남겼을 때 || //정보공유로 내가 글을 남겨놨는데 누가 내 게시글에 댓글 남겼을때(커뮤니티, 정보공유랑 query달라져야함)
  MY_COMMUNITY_MASTER_REQUEST = 'my_community_master_request', //해당 그룹의 관리자가 나를 관리자로 임명했을때 (1:1 관리자로 지목된 이에게 전달)
  HELPYOU = 'helpYou', //나를 누군가가 helpYou 했을때

  // COMMUNITY_INVITE = "community_invite", //다른 유저가 해당 그룹에 나를 초대했을 때
  // CREATE_COMMUNITY_POST_AUTHOR_USER = "create_community_post_author_user", //다른 유저가 해당 그룹에 게시물을 올렸을 때
  // MY_INVITE_USER_APPROVE = "my_invite_user_approve", //내가 초대한 유저가 초대를 수락했을 때
  // MY_COMMUNITY_NAME_CHANGE = "my_community_name_change", //해당 그룹의 관리자가 그룹 이름을 변경했을 때
  // MY_COMMINITY_DESC_CHANGE = "my_comminity_desc_change", //해당 그룹의 관리자가 그룹 설명을 업데이트 했을 때
}

@ObjectType()
export class NotificationObject {
  @Field()
  id: number;

  @Field()
  user: UserObject;

  @Field()
  requester: UserObject;

  @Field()
  category: NOTIFICATION_CATEGORY;

  @Field({nullable: true})
  community: CommunityListObject;

  @Field()
  communityPost: PostObject;

  @Field()
  communityPostComment: CommunityPostCommentObject;
}

@ObjectType()
export class NotificationItemObject {
  @Field({nullable: true})
  id: number;

  @Field({nullable: true})
  category: NOTIFICATION_CATEGORY;

  @Field({nullable: true})
  checked: Boolean;

  @Field({nullable: true})
  notificationValue: String;

  @Field({nullable: true})
  communityId: Number;

  @Field({nullable: true})
  communityPostId: Number;

  @Field({nullable: true})
  communityPostValue: String;

  @Field({nullable: true})
  commentValue: String;

  @Field({nullable: true})
  requesterImg: String;

  @Field({nullable: true})
  requesterName: String;

  @Field({nullable: true})
  requesterId: Number;

  @Field({nullable: true})
  communityName: String;

  @Field({nullable: true})
  createdDate: Date;
}
