import { Context } from "server/express";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { NotificationEntity } from "../entities/Notification.entity";
import { NotificationCreateInput } from "../inputs/NotificationCreate.input";
import { NotificationCategoryWhereInput } from "../inputs/NotificationCategoryWhere.input";
import {
  NotificationItemObject,
  NotificationObject,
} from "../objects/Notification.object";
import { NotificationWhereInput } from "../inputs/NotificationWhereInput.input";
import { createQueryBuilder, getConnection } from "typeorm";
import { NotificationListWhereInput } from "../inputs/NotificationListWhere.input";
import { customNotification } from "../service/notification.service";

//알림 View에서, filtering을 하기위한 enum
enum NOTIFICATION_TYPE {
  ALL = "all",
  COMMUNITY = "community",
  HELPYOU = "helpYou",
  INFORMATION_COMMUNITY = "information_community",
}

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

@Resolver()
export class NotificationResolver {
  @Mutation(() => Boolean)
  async createNotification(
    @Ctx() ctx: Context,
    @Arg("where") where: NotificationCategoryWhereInput,
    @Arg("data") data: NotificationCreateInput
  ) {
    try {
      const type = where.category;

      //알람을 울리게 한 당사자
      const requester = ctx.user.userId;

      //알림을 전달 받을 사람
      const receiver = where.receiver;

      await NotificationEntity.create({
        category: type,
        requester: {
          mrloginId: requester,
        },
        user: {
          mrloginId: receiver,
        },
        community: {
          id: data.community,
        },
        communityPost: {
          id: data.communityPost,
        },
        communityPostComment: {
          id: data.communityPostComment,
        },
      }).save();

      return true;
    } catch (e) {
      console.log("createNotification Erorr: ", e);
      return false;
    }
  }

  @Query(() => Number)
  async LatestNotificationCount(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const type = "all";

      const notificationListQueryProcesse = NotificationEntity.createQueryBuilder(
        "notification"
      )
        .leftJoinAndSelect("notification.user", "user")
        .leftJoinAndSelect("notification.requester", "requester")
        .leftJoinAndSelect("notification.community", "community")
        .leftJoinAndSelect("notification.communityPost", "communityPost")
        .leftJoinAndSelect(
          "notification.communityPostComment",
          "communityPostComment"
        )
        .leftJoinAndSelect(
          "communityPostComment.communityPost",
          "commentOfcommunityPost"
        )
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere("checked = :checked", { checked: false });
      const notificationList = await notificationListQueryProcesse
        .orderBy("notification.createdDate", "DESC")
        .getMany();

      return notificationList.length;
    } catch (e) {
      console.log("LatestnotificationList Error :", e);
      return null;
    }
  }

  @Query(() => [NotificationItemObject])
  async notificationList(
    @Arg("where") where: NotificationListWhereInput,
    @Ctx() ctx: Context
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const type = where.type;

      const notificationListQueryProcesse = NotificationEntity.createQueryBuilder(
        "notification"
      )
        .leftJoinAndSelect("notification.user", "user")
        .leftJoinAndSelect("notification.requester", "requester")
        .leftJoinAndSelect("notification.community", "community")
        .leftJoinAndSelect("notification.communityPost", "communityPost")
        .leftJoinAndSelect(
          "notification.communityPostComment",
          "communityPostComment"
        )
        .leftJoinAndSelect(
          "communityPostComment.communityPost",
          "commentOfcommunityPost"
        )
        .where("user.mrloginId = :mrloginId", { mrloginId });

      if (type === NOTIFICATION_TYPE.ALL) {
        const notificationList = await notificationListQueryProcesse
          .orderBy("notification.createdDate", "DESC")
          .getMany();

        return customNotification(notificationList);
      } else if (type === NOTIFICATION_TYPE.COMMUNITY) {
        const notificationList = notificationListQueryProcesse
          .andWhere(
            "(notification.category = :category_first OR notification.category = :category_second OR notification.category = :category_third OR notification.category = :category_four)",
            {
              category_first: NOTIFICATION_CATEGORY.COMMUNITY_APPROVE,
              category_second: NOTIFICATION_CATEGORY.COMMUNITY_REQUEST,
              category_third:
                NOTIFICATION_CATEGORY.COMMUNITY_POST_AUTHOR_USER_COMMENT,
              category_four: NOTIFICATION_CATEGORY.MY_COMMUNITY_MASTER_REQUEST,
            }
          )
          .orderBy("notification.createdDate", "DESC")
          .getMany();
        return customNotification(notificationList);
      } else if (type === NOTIFICATION_TYPE.INFORMATION_COMMUNITY) {
        const notificationList = notificationListQueryProcesse
          .andWhere("notification.category = :category", {
            category:
              NOTIFICATION_CATEGORY.INFORMATION_POST_AUTHER_USER_COMMENT,
          })
          .orderBy("notification.createdDate", "DESC")
          .getMany();
        return customNotification(notificationList);
      } else if (type === NOTIFICATION_TYPE.HELPYOU) {
        const notificationList = notificationListQueryProcesse
          .andWhere("notification.category = :category", {
            category: NOTIFICATION_CATEGORY.HELPYOU,
          })
          .orderBy("notification.createdDate", "DESC")
          .getMany();
        return customNotification(notificationList);
      }
    } catch (e) {
      console.log("notificationList Error :", e);
      return null;
    }
  }

  @Query(() => Boolean)
  //내가 해당 notification을 클릭했던 notification인지를 확인하기 위함
  async isClickNotification(@Arg("where") where: NotificationWhereInput) {
    try {
      const notificationId = where.notificationId;
      const isClick = await NotificationEntity.createQueryBuilder(
        "notification"
      )
        .where("notification.id = :id", { id: notificationId })
        .getOne();

      if (isClick.checked === true) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("isClickNotification Error: ", e);
    }
  }

  @Mutation(() => Boolean)
  //notification을 클릭했을때 해당 클릭효과를 내기 위함
  async updateNotification(@Arg("where") where: NotificationWhereInput) {
    try {
      const notificationId = where.notificationId;

      await createQueryBuilder()
        .update(NotificationEntity)
        .set({
          checked: true,
        })
        .where("id = :id", { id: notificationId })
        .execute();

      return true;
    } catch (e) {
      console.log("updateNotification Error :", e);
      return false;
    }
  }
}
