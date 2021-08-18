import { Context } from "server/express";
import { CommunityMemberEntity } from "../../CommunityMember/entities/CommunityMember.entity";
import { CommunityMemberTopRankListWhereInput } from "../../CommunityMember/inputs/CommunityMemberTopRankListWhere.input";
import { CommunityMemberTopRankObject } from "../../CommunityMember/objects/CommunityMemberTopRank.object";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection } from "typeorm";
import { CommunityPostCommentEntity } from "../entities/CommunityPostComment.entity";
import { CommunityCommentDeleteWhereInput } from "../inputs/CommunityCommentDeleteWhere.input";
import { CommunityCommentWhereInput } from "../inputs/CommunityCommentWhere.input";
import { CommunityPostCommentCreateDataInput } from "../inputs/CommunityPostCommentCreateData.input";
import { CommunityPostCommentCreateWhereInput } from "../inputs/CommunityPostCommentCreateWhere.input";
import { CommunityPostCommentWhereInput } from "../inputs/CommunityPostCommentWhere.input";
import { CommunityPostCommentObject } from "../objects/CommunityPostComment.object";
import { createNotification } from "../../Notification/service/notification.service";
import { getCommunityPostCommentEntity } from "../service/communityPostComment.service";
import { NOTIFICATION_CATEGORY } from "../../Notification/entities/Notification.entity";
import { getCommunityPostEntity } from "../../CommunityPost/service/communityPost.service";

@Resolver()
export class CommunityPostCommentResolver {
  @Query(() => [CommunityPostCommentObject])
  async communityCommentList(@Arg("where") where: CommunityCommentWhereInput) {
    try {
      const communityPostId = where.communityPostId;

      const currentCommunityPostCommentList = await CommunityPostCommentEntity.createQueryBuilder(
        "communityPostComment"
      )
        .leftJoinAndSelect(
          "communityPostComment.communityPost",
          "communityPost"
        )
        .leftJoinAndSelect("communityPostComment.user", "user")
        .where("communityPost.id = :id", {
          id: communityPostId,
        })
        .andWhere("communityPostComment.isVisble = true")
        .getMany();
      console.log(
        "currentCommunityPostCommentList: ",
        currentCommunityPostCommentList
      );

      return currentCommunityPostCommentList;
    } catch (e) {
      console.log("communityCommentList: ", e);
      return null;
    }
  }
  @Mutation(() => Boolean)
  async createCommunityPostComment(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityPostCommentCreateWhereInput,
    @Arg("data") data: CommunityPostCommentCreateDataInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const communityPostId = where.communityPost;

      const communityPostCommentEntity = await CommunityPostCommentEntity.create(
        {
          communityPost: {
            id: communityPostId,
          },
          content: data.content,
          user: {
            mrloginId,
          },
        }
      ).save();

      const communityPostInfo = await getCommunityPostEntity(communityPostId);

      console.log("communityPostInfo: ", communityPostInfo?.disclosureRange);

      if (mrloginId !== communityPostInfo?.user?.mrloginId) {
        if (communityPostInfo?.disclosureRange === "all") {
          createNotification({
            requester: mrloginId,
            receiver: communityPostInfo?.user?.mrloginId,
            type: NOTIFICATION_CATEGORY.INFORMATION_POST_AUTHER_USER_COMMENT,
            communityPostCommentEntity,
          });
        } else if (communityPostInfo?.disclosureRange === "community") {
          createNotification({
            requester: mrloginId,
            receiver: communityPostInfo?.user?.mrloginId,
            type: NOTIFICATION_CATEGORY.COMMUNITY_POST_AUTHOR_USER_COMMENT,
            communityPostCommentEntity,
          });
        }
      }

      return true;
    } catch (e) {
      console.log("createCommunityPostComment Error :", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async updateCommunityPostComment(
    @Arg("where") where: CommunityPostCommentWhereInput,
    @Arg("data") data: CommunityPostCommentCreateDataInput
  ) {
    try {
      await createQueryBuilder()
        .update(CommunityPostCommentEntity)
        .set({
          ...data,
        })
        .where("id = :id", { id: where.commentId })
        .execute();

      return true;
    } catch (e) {
      console.log("updateCommunityPostComment Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteCommunityPostComment(
    @Arg("where") where: CommunityCommentDeleteWhereInput
  ) {
    try {
      const communityPostCommentId = where.communityPostCommentId;

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(CommunityPostCommentEntity)
        .where("id = :id", { id: communityPostCommentId })
        .execute();

      return true;
    } catch (e) {
      console.log("deleteCommunityPostComment: ", e);
      return false;
    }
  }
}
