import {UserEntity} from '../../User/entities/User.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {CommunityEntity} from '../../Community/entities/Community.entity';
import {CommunityPostEntity} from '../../CommunityPost/entities/CommunityPost.entity';
import {CommunityPostCommentEntity} from '../../CommunityPostComment/entities/CommunityPostComment.entity';

// enum NOTIFICATION_DESCRIPTION {
// RECOMMAND = "님이 내 게시물을 추천했어요.",
// COMMENT = "님이 내 게시물에 댓글을 남겼습니다.",
// INVITE = "글쓴이 님이 나를 차를 사랑하는 사람들 커뮤니티에 초대했습니다.",
// HELPYOU = "님이 나를 헬프유했어요.",
// SHARE = "님이 정보를 공유했어요.",
// MYINFORECOMMAND = "님이 내 정보를 추천했어요.",

//   RECOMMAND = 10,
//   COMMENT = 20,
//   INVITE = 30,
//   HELPYOU = 40,
//   SHARE = 50,
//   MYINFORECOMMAND = 60,
// }

export enum NOTIFICATION_CATEGORY {
  //notification을 등록할때 사용되는 category
  COMMUNITY_REQUEST = 'community_request', //커뮤니티 요청했을때 (1:1 커뮤니티 관리자에게 전달)
  COMMUNITY_APPROVE = 'community_approve', //커뮤니티 승인했을때 (1:1 커뮤니티 요청자에게 전달)
  MY_COMMUNITY_MASTER_REQUEST = 'my_community_master_request', //해당 그룹의 관리자가 나를 관리자로 임명했을때 (1:1 관리자로 지목된 이에게 전달)
  COMMUNITY_POST_AUTHOR_USER_COMMENT = 'community_post_author_user_comment', //내가 올린 글에 유저가 댓글을 남겼을 때
  INFORMATION_POST_AUTHER_USER_COMMENT = 'information_post_auther_user_comment', //정보공유로 내가 글을 남겨놨는데 누가 내 게시글에 댓글 남겼을때(커뮤니티, 정보공유랑 query달라져야함)
  HELPYOU = 'helpYou', //나를 누군가가 helpYou 했을때

  // TO DO LIST (1:N) 관계의 알림기능
  // COMMUNITY_INVITE = "community_invite", //다른 유저가 해당 그룹에 나를 초대했을 때
  // CREATE_COMMUNITY_POST_AUTHOR_USER = "create_community_post_author_user", //다른 유저가 해당 그룹에 게시물을 올렸을 때
  // MY_INVITE_USER_APPROVE = "my_invite_user_approve", //내가 초대한 유저가 초대를 수락했을 때
  // MY_COMMUNITY_NAME_CHANGE = "my_community_name_change", //해당 그룹의 관리자가 그룹 이름을 변경했을 때
  // MY_COMMINITY_DESC_CHANGE = "my_comminity_desc_change", //해당 그룹의 관리자가 그룹 설명을 업데이트 했을 때
}

@Entity()
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //알람을 당하는 사람
  @ManyToOne(
    type => UserEntity,
    user => user.notification,
    {cascade: true, onDelete: 'CASCADE'},
  )
  user: UserEntity;

  //알람을 보내는 사람
  @ManyToOne(
    type => UserEntity,
    user => user.notification,
  )
  requester: UserEntity;

  // @Column({
  //   type: "enum",
  //   enum: NOTIFICATION_DESCRIPTION,
  //   default: NOTIFICATION_DESCRIPTION.RECOMMAND,
  // })
  // description: NOTIFICATION_DESCRIPTION;

  @Column({
    type: 'enum',
    enum: NOTIFICATION_CATEGORY,
  })
  category: NOTIFICATION_CATEGORY;

  @ManyToOne(
    type => CommunityEntity,
    community => community.notification,
    {nullable: true},
  )
  community: CommunityEntity;

  @ManyToOne(
    type => CommunityPostEntity,
    communityPost => communityPost.notification,
    {nullable: true},
  )
  communityPost: CommunityPostEntity;

  @ManyToOne(
    type => CommunityPostCommentEntity,
    communityPostComment => communityPostComment.notification,
    {nullable: true, cascade: true, onDelete: 'CASCADE'},
  )
  communityPostComment: CommunityPostCommentEntity;

  @Column({default: false})
  checked: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
