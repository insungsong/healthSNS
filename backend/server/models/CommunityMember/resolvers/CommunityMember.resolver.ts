import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import { Context } from "server/express";
import { getCommunityEntity } from "../../Community/service/community.service";
import { NOTIFICATION_CATEGORY } from "../../Notification/entities/Notification.entity";
import { createNotification } from "../../Notification/service/notification.service";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection } from "typeorm";
import { CommunityMemberEntity } from "../entities/CommunityMember.entity";
import { CommunityExitMemeberWhereInput } from "../inputs/CommunityExitMemeberWhereInput.input";
import { CommunityIsRankWhereInput } from "../inputs/CommunityIsRankWhere.input";
import { CommunityMemberAccessWhereInput } from "../inputs/CommunityMemberAccessWhere.input";
import { CommunityMemberCreateInput } from "../inputs/CommunityMemberCreate.input";
import { CommunityMemberRankChangeWhereInput } from "../inputs/CommunityMemberRankChangeWhereInput.input";
import { CommunityMemberTopRankListWhereInput } from "../inputs/CommunityMemberTopRankListWhere.input";
import { CommunityMemberWhereInput } from "../inputs/CommunityMemberWhere.input";
import { SignOutCommunityMemberWhereInput } from "../inputs/SignOutCommunityMemberWhere.input";
import {
  CommunityMemberListInfoObject,
  CommunityMemberObject,
} from "../objects/CommunityMember.object";
import { CommunityMemberTopRankObject } from "../objects/CommunityMemberTopRank.object";

import {
  createCommunityMemberEntity,
  getCommunityMemberEntity,
  getCommunityMemberTopRankerList,
} from "../service/communityMember.service";
import { CommunityIsRankObject } from "../objects/CommunityIsRank.object";

enum Type {
  ACCESS = "access",
  CANCEL = "cancel",
}

@Resolver()
export class CommunityMemberResolver {
  @Query(() => [CommunityMemberTopRankObject])
  //커뮤니티의 멤버들중 마스터와 매니저의 리스트를 보여주는 query
  async communityMemberTopRankerList(
    @Arg("where") where: CommunityMemberTopRankListWhereInput
  ) {
    try {
      const communityId = where.communityId;
      const topRankList = await getCommunityMemberTopRankerList(communityId);
      console.log("topRankList: ", topRankList);
      return topRankList;
    } catch (e) {
      console.log("topRankerList Error: ", e);
      return null;
    }
  }

  @Query(() => CommunityIsRankObject)
  //내가 해당 커뮤니티에 어떤 rank인지를 보기위한 query
  async communityIsRank(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityIsRankWhereInput
  ) {
    try {
      //myComminityList API로 부터 나오는 query에 community
      // const communityMemberId = where.communityMemberId;
      const userId = ctx.user.userId;
      //해당 communityMember의 row의 column rank가 user인지 확인하는 코드
      const currentCommunityMemberInfo = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.user", "user")
        .leftJoinAndSelect("communityMember.community", "community")
        .where("community.id = :communityId", {
          communityId: where.communityId,
        })
        .andWhere("user.mrloginId = :id", { id: userId })
        .getOne();
      console.log("currentCommunityMemberInfo : ", currentCommunityMemberInfo);

      const isRankUser = currentCommunityMemberInfo.rank;
      const memberId = currentCommunityMemberInfo.id;
      const isApprove = currentCommunityMemberInfo.isApprove;
      console.log("isRankUser: ", isRankUser);
      console.log("memberId: ", memberId);
      if (isRankUser === "master") {
        return {
          communityMemberId: memberId,
          rank: "master",
          isApprove: isApprove,
        };
      } else if (isRankUser === "manager") {
        return {
          communityMemberId: memberId,
          rank: "manager",
          isApprove: isApprove,
        };
      } else {
        return {
          communityMemberId: memberId,
          rank: "user",
          isApprove: isApprove,
        };
      }
    } catch (e) {
      console.log("communityIsMaster Error:", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //커뮤니티 멤버가입 요청을 하는 mutation
  async requestCommunityMember(
    @Ctx() ctx: Context,
    @Arg("data") data: CommunityMemberCreateInput
  ) {
    try {
      const mrloginId = ctx.user.userId;
      const communityId = data.communityId;
      const communityEntity = await getCommunityEntity(communityId);

      const topRankList = await getCommunityMemberTopRankerList(communityId);
      console.log("topRankList: ", topRankList);
      for (let i = 0; i < topRankList.length; i++) {
        const topRanker = topRankList[i];
        await createNotification({
          requester: mrloginId,
          receiver: topRanker?.user?.mrloginId,
          type: NOTIFICATION_CATEGORY.COMMUNITY_REQUEST,
          communityEntity: communityEntity,
        });
      }

      await createCommunityMemberEntity(mrloginId, communityId);

      return true;
    } catch (e) {
      console.log("createComminityMember Error: ", e);
      return false;
    }
  }

  //커뮤니티 가입 요청 List Query
  @Query(() => [CommunityMemberListInfoObject])
  async communityMemberRequestList(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityMemberWhereInput
  ) {
    try {
      // const userId= ctx.user.id;
      const mrloginId = ctx.user.userId;

      const communityId = where.communityId;

      //해당 커뮤니티의 마스터가 누구인지?
      let queryProcessing = CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.community", "community")
        .leftJoinAndSelect("communityMember.user", "user");

      const isRankInfo = await queryProcessing
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere("community.id = :id", { id: communityId })
        .getOne();

      const isRank = isRankInfo.rank;

      let filterArr = [];

      if (isRank === "master" || isRank === "manager") {
        const requestCommintiyMemberList = await queryProcessing
          .where("community.id = :id", { id: communityId })
          .andWhere("communityMember.isApprove = false")
          .getMany();

        const filterProcessing = requestCommintiyMemberList.map(
          (item, index) => {
            filterArr.push({ id: item.id, user: item.user });
          }
        );

        await Promise.all(filterProcessing);
      }
      return filterArr;
    } catch (e) {
      console.log("communityMemberRequestList Error: ", e);
      return null;
    }
  }

  //커뮤니티 가입 요청 리스트에서 가입 승인또는 취소하는 mutation
  @Mutation(() => Boolean)
  async communityMemberAccess(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityMemberAccessWhereInput
  ) {
    try {
      // const userId= ctx.user.id;
      const mrloginId = ctx.user.userId;

      const type = where.type;
      const communityMemberId = where.communityMemberId;

      //해당 커뮤니티의 마스터가 누구인지?
      const queryProcessing = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.community", "community")
        .leftJoinAndSelect("communityMember.user", "user");

      //내가 속한 커뮤니티 정보
      const currentCommunityInfo = await queryProcessing
        .andWhere("communityMember.id = :id", { id: communityMemberId })
        .getOne();

      console.log("currentCommunityInfo: ", currentCommunityInfo);

      //내가 속한 커뮤니티 정보를 통하여 마스터 찾기
      const isHightRank = await queryProcessing
        .where("communityMember.community = :community", {
          community: currentCommunityInfo.community.id,
        })
        .andWhere("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere(
          "communityMember.rank = 'master' OR communityMember.rank = 'manager'"
        )
        .andWhere("communityMember.isApprove = true")
        .getOne();

      // 해당 커뮤니티의 마스터와 ctx.user.id값이 같다면
      if (isHightRank.rank === "master" || isHightRank.rank === "manager") {
        if (type === Type.ACCESS) {
          const communityEntity = await getCommunityEntity(
            currentCommunityInfo?.community?.id
          );

          createNotification({
            requester: mrloginId,
            receiver: currentCommunityInfo?.user?.mrloginId,
            type: NOTIFICATION_CATEGORY.COMMUNITY_APPROVE,
            communityEntity,
          });

          await createQueryBuilder()
            .update(CommunityMemberEntity)
            .set({
              isApprove: true,
            })
            .where("id = :id", { id: communityMemberId })
            .execute();
        } else {
          //수락이 아닌경우 즉, 취소의 경우
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(CommunityMemberEntity)
            .where("id = :id", { id: communityMemberId })
            .execute();
        }
      } else {
        return false;
      }

      return true;
    } catch (e) {
      console.log("communityMemberAccess Error: ", e);
      return false;
    }
  }

  @Query(() => [CommunityMemberObject])
  //커뮤니티 가입자 리스트를 보는 query
  async communityMemberList(
    @Arg("where") where: CommunityMemberWhereInput,
    @Ctx() ctx: Context
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const communityId = where.communityId;

      const currentCommunityIsMyRankInfo = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId: mrloginId })
        .andWhere("communityMember.community = :community", {
          community: communityId,
        })
        .getOne();

      const isRank = currentCommunityIsMyRankInfo.rank;

      const communityMemberList = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.user", "user")
        .where("communityMember.community = :community", {
          community: communityId,
        })
        // .andWhere("communityMember.rank = 'user'")
        .andWhere("communityMember.isApprove = true")
        .getMany();

      return communityMemberList;
    } catch (e) {
      console.log("communityMembers Error: ", e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  //관리자 등급을 유저의 등급을 지정할 수 있다.
  async communityMemberRankChange(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityMemberRankChangeWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const changeRank = where.rank;

      const isMaster = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere("communityMember.rank = 'master'")
        .getOne();

      const communityMemberId = where.communityMemberId;

      const communityEntity = await getCommunityMemberEntity(communityMemberId);

      createNotification({
        requester: mrloginId,
        receiver: communityEntity?.user?.mrloginId,
        type: NOTIFICATION_CATEGORY.MY_COMMUNITY_MASTER_REQUEST,
        communityEntity: communityEntity.community,
      });

      if (isMaster) {
        await createQueryBuilder()
          .update(CommunityMemberEntity)
          .set({
            rank: changeRank,
          })
          //1.해당 커뮤니티의 id인지
          .where("community = :community", { community: where.communityId })
          //2.변환시킬 커뮤니티 멤버 row id
          .andWhere("id = :id", { id: where.communityMemberId })
          .execute();
        return true;
      }

      return false;
    } catch (e) {
      console.log("communityMemberRankChange Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //커뮤니티에서 내가 스스로 탈퇴해서 나오는 경우
  async signOutCommunityMember(
    @Arg("where") where: SignOutCommunityMemberWhereInput
  ) {
    try {
      //myComminityList API로 부터 나오는 query에 community
      const communityMemberId = where.communityMemberId;

      //해당 communityMember의 row의 column rank가 user인지 확인하는 코드
      const currentCommunityMemberInfo = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .where("id = :id", { id: communityMemberId })
        .getOne();

      const isRankUser = currentCommunityMemberInfo.rank;

      if (isRankUser === "user" || isRankUser === "manager") {
        //유저가 해당 Member의 경우에만 커뮤니티를 삭제할 수 있도록 우선 적으로 로직을 구성했습니다.
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(CommunityMemberEntity)
          .where("id = :id", { id: communityMemberId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("signUpCommunityMember: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //커뮤니티에서 해당 멤버를 강퇴시키는 Mutation입니다.
  async communityExitMember(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityExitMemeberWhereInput
  ) {
    try {
      const communityMemberId = where.communityMemberId;

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(CommunityMemberEntity)
        .where("id = :id", { id: communityMemberId })
        .execute();
      return true;
    } catch (e) {
      console.log("communityMember Error: ", e);
      return false;
    }
  }
}
