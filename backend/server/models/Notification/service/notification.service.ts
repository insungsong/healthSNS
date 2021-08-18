import {CommunityEntity} from '../../Community/entities/Community.entity';
import {CommunityPostEntity} from '../../CommunityPost/entities/CommunityPost.entity';
import {CommunityPostCommentEntity} from '../../CommunityPostComment/entities/CommunityPostComment.entity';
import {
  NotificationEntity,
  NOTIFICATION_CATEGORY,
} from '../../Notification/entities/Notification.entity';

interface ICreateNotification {
  //알람을 울리게 한 당사자
  requester: number;
  //알림을 전달 받을 사람
  receiver: number;
  type: NOTIFICATION_CATEGORY;
  communityEntity?: CommunityEntity;
  communityPostEntity?: CommunityPostEntity;
  communityPostCommentEntity?: CommunityPostCommentEntity;
}

export const customNotification = async (notificationList: any) => {
  try {
    const stackedNotification = await notificationList;

    console.log('🔑 ', stackedNotification);

    let customNotificationArr = [];

    for (let i = 0; i <= stackedNotification.length; i++) {
      const currentNotificationInfo = stackedNotification[i];

      //알림 id
      const currentNotificationId = currentNotificationInfo?.id;

      //알림 createdDate
      const currentNotificationCreatedDate =
        currentNotificationInfo?.createdDate;

      //알림 카테고리
      const currentNotificationCategory = currentNotificationInfo?.category;

      //알림 체크 읽었는지에 따른 유무
      const currentIsNotificationChecked = currentNotificationInfo?.checked;

      //알림을 받는 사람
      const currentNotificationUser = currentNotificationInfo?.user?.name;

      //알림을 보낸 사람
      const currentNotificationRequester =
        currentNotificationInfo?.requester?.name;

      //알림이 올리게된 community 이름
      const currentNotificationConectCommunity =
        currentNotificationInfo?.community?.title;
      const currentNotificationConectCommunityId =
        currentNotificationInfo?.community?.id;

      //알림을 보낸 사람 image
      const currentNotificationRequesterImage =
        currentNotificationInfo?.requester?.profile;
      const currentNotificationRequesterId =
        currentNotificationInfo?.requester?.mrloginId;

      //알림이 울린 해당 댓글의 내용
      const currentNotificationCommentValue =
        currentNotificationInfo?.communityPostComment?.content;
      const currentNotificationCommentPostId =
        currentNotificationInfo?.communityPostComment?.communityPost?.id;

      if (currentNotificationCategory === 'community_request') {
        //커뮤니티 요청했을때 (1:1 커뮤니티 관리자에게 전달)
        customNotificationArr.push({
          id: currentNotificationId,
          category: currentNotificationCategory,
          checked: currentIsNotificationChecked,
          notificationValue: `${currentNotificationRequester}님이 ${currentNotificationConectCommunity}에 가입신청을 했습니다.`,
          requesterImg: currentNotificationRequesterImage,
          requesterName: currentNotificationRequester,
          communityName: currentNotificationConectCommunity,
          communityId: currentNotificationConectCommunityId,
          createdDate: currentNotificationCreatedDate,
        });
      } else if (currentNotificationCategory === 'community_approve') {
        //커뮤니티 승인했을때 (1:1 커뮤니티 요청자에게 전달)
        customNotificationArr.push({
          id: currentNotificationId,
          category: currentNotificationCategory,
          checked: currentIsNotificationChecked,
          notificationValue: `${currentNotificationConectCommunity} 가입 요청이 승인되었습니다.`,
          requesterImg: currentNotificationRequesterImage,
          requesterName: currentNotificationRequester,
          communityName: currentNotificationConectCommunity,
          communityId: currentNotificationConectCommunityId,
          createdDate: currentNotificationCreatedDate,
        });
      } else if (
        currentNotificationCategory === 'community_post_author_user_comment'
      ) {
        console.log('.....');
        //내가 올린 글에 유저가 댓글을 남겼을 때 || //정보공유로 내가 글을 남겨놨는데 누가 내 게시글에 댓글 남겼을때(커뮤니티, 정보공유랑 query달라져야함)
        customNotificationArr.push({
          id: currentNotificationId,
          category: currentNotificationCategory,
          checked: currentIsNotificationChecked,
          notificationValue: `${currentNotificationRequester}님이 회원님의 커뮤니티 게시물에 댓글을 남겼습니다.`,
          commentValue: `${currentNotificationCommentValue}`,
          communityPostId: currentNotificationCommentPostId,
          requesterImg: currentNotificationRequesterImage,
          requesterName: currentNotificationRequester,
          createdDate: currentNotificationCreatedDate,
        });
      } else if (
        currentNotificationCategory === 'information_post_auther_user_comment'
      ) {
        customNotificationArr.push({
          id: currentNotificationId,
          category: currentNotificationCategory,
          checked: currentIsNotificationChecked,
          notificationValue: `${currentNotificationRequester}님이 회원님의 정보 공유 게시물에 댓글을 남겼습니다.`,
          commentValue: `${currentNotificationCommentValue}`,
          communityPostId: currentNotificationCommentPostId,
          requesterImg: currentNotificationRequesterImage,
          requesterName: currentNotificationRequester,
          createdDate: currentNotificationCreatedDate,
        });
      } else if (
        currentNotificationCategory === 'my_community_master_request'
        //해당 그룹의 관리자가 나를 관리자로 임명했을때 (1:1 관리자로 지목된 이에게 전달)
      ) {
        customNotificationArr.push({
          id: currentNotificationId,
          category: currentNotificationCategory,
          checked: currentIsNotificationChecked,
          notificationValue: `${currentNotificationRequester}님이 회원님을 ${currentNotificationConectCommunity}관리자로 초대했습니다.`,
          communityName: currentNotificationConectCommunity,
          requesterImg: currentNotificationRequesterImage,
          requesterName: currentNotificationRequester,
          communityId: currentNotificationConectCommunityId,
          createdDate: currentNotificationCreatedDate,
        });
      } else if (currentNotificationCategory === 'helpYou') {
        //나를 누군가가 helpYou 했을때
        customNotificationArr.push({
          id: currentNotificationId,
          category: currentNotificationCategory,
          checked: currentIsNotificationChecked,
          notificationValue: `${currentNotificationRequester}님이 회원님을 헬프유 했어요.`,
          requesterImg: currentNotificationRequesterImage,
          requesterName: currentNotificationRequester,
          requesterId: currentNotificationRequesterId,
          createdDate: currentNotificationCreatedDate,
        });
      }
    }
    // console.log('customNotificationArr: ', customNotificationArr);
    return customNotificationArr;
  } catch (e) {
    console.log('customNotification Error: ', e);
  }
};

export const createNotification = async ({
  requester,
  receiver,
  type,
  communityEntity,
  communityPostEntity,
  communityPostCommentEntity,
}: ICreateNotification) => {
  try {
    await NotificationEntity.create({
      category: type,
      requester: {
        mrloginId: requester,
      },
      user: {
        mrloginId: receiver,
      },
      community: communityEntity,
      communityPost: communityPostEntity,
      communityPostComment: communityPostCommentEntity,
    }).save();

    return true;
  } catch (e) {
    console.log('createNotification Erorr: ', e);
    return false;
  }
};
