import { CommunityEntity } from "../../Community/entities/Community.entity";
import { CommunityPostEntity } from "../../CommunityPost/entities/CommunityPost.entity";
import { CommunityPostCommentEntity } from "../../CommunityPostComment/entities/CommunityPostComment.entity";
import {
  NotificationEntity,
  NOTIFICATION_CATEGORY,
} from "../../Notification/entities/Notification.entity";

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

export const getCommunityPostCommentEntity = async (id: number) => {
  try {
    return CommunityPostCommentEntity.findOne({ id });
  } catch (e) {
    console.log("getCommunityPostCommentEntity Error: ", e);
    return null;
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
    console.log("createNotification Erorr: ", e);
    return false;
  }
};
