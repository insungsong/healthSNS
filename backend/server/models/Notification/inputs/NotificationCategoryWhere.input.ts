import { Field, InputType } from "type-graphql";

//알림 Entity를 만들때, 사용되는 Notification Category
enum NOTIFICATION_CATEGORY {
  //notification을 등록할때 사용되는 category
  COMMUNITY_REQUEST = "community_request", //커뮤니티 요청했을때 (1:1 커뮤니티 관리자에게 전달)
  COMMUNITY_APPROVE = "community_approve", //커뮤니티 승인했을때 (1:1 커뮤니티 요청자에게 전달)
  MY_COMMUNITY_MASTER_REQUEST = "my_community_master_request", //해당 그룹의 관리자가 나를 관리자로 임명했을때 (1:1 관리자로 지목된 이에게 전달)
  COMMUNITY_POST_AUTHOR_USER_COMMENT = "community_post_author_user_comment", //내가 올린 글에 유저가 댓글을 남겼을 때
  INFORMATION_POST_AUTHER_USER_COMMENT = "information_post_auther_user_comment", //정보공유로 내가 글을 남겨놨는데 누가 내 게시글에 댓글 남겼을때(커뮤니티, 정보공유랑 query달라져야함)
  HELPYOU = "helpYou", //나를 누군가가 helpYou 했을때
}

@InputType()
export class NotificationCategoryWhereInput {
  @Field()
  category: NOTIFICATION_CATEGORY;

  @Field()
  receiver: number;
}
