import { Context } from "server/express";
import {
  CommunityMemberEntity,
  CommunityMemberRank,
} from "../../CommunityMember/entities/CommunityMember.entity";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CommunityEntity } from "../entities/Community.entity";
import { CommunityCreateInput } from "../inputs/CommunityCreate.input";
import { CommunityUpdateInput } from "../inputs/CommunityUpdate.input";
import { CommunityUpdateWhereInput } from "../inputs/CommunityUpdateWhere.input";
import {
  ConnectionIsNotSetError,
  createQueryBuilder,
  getConnection,
} from "typeorm";
import { CommunityDeleteInput } from "../inputs/CommunityDelete.input";
import {
  CommunityListObject,
  CommunityObject,
  IsCommunityMemberObject,
} from "../objects/Community.object";
import { CommunityMemberCreateInput } from "../../CommunityMember/inputs/CommunityMemberCreate.input";
import { CommunityListType } from "../inputs/CommunityKindOfList.input";
import { CommunityInfoWhereInput } from "../inputs/CommunityInfoWhere.input";
import { CommunityInfoObject } from "../objects/CommunityInfo.object";
import { CommunityTermWhereInput } from "../inputs/CommunityTermWhere.input";
import { SearchCommunityListObject } from "../objects/SearchCommunity.object";
import { CommunityClosingUpdateInput } from "../inputs/CommunityClosingUpdate.input";
import { CommunityPostCommentCreateDataInput } from "server/models/CommunityPostComment/inputs/CommunityPostCommentCreateData.input";
import { Console } from "console";

enum Type {
  JOINED = "joined",
  MYCOMMUNITY = "mycommunity",
}
@Resolver()
export class CommunityResolver {
  @Mutation(() => CommunityInfoObject)
  //커뮤니티를 생성하는 mutation
  async createCommunity(
    @Ctx() ctx: Context,
    @Arg("data") data: CommunityCreateInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const newCommunity = await CommunityEntity.create({
        title: data.title,
        image: data.image,
        description: data.description,
      }).save();

      await CommunityMemberEntity.create({
        user: {
          mrloginId,
        },
        community: {
          id: newCommunity.id,
        },
        isApprove: true,
        rank: CommunityMemberRank.MASTER,
      }).save();

      return newCommunity;
    } catch (e) {
      console.log("createCommunity Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //커뮤니티 업데이트 하는 mutation
  //폐쇄하기를 제외한 나머지 update 커뮤니티 업데이트 기능
  async updateCommunity(
    @Ctx() ctx: Context,
    @Arg("data") data: CommunityUpdateInput,
    @Arg("where") where: CommunityUpdateWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const communityId = where.communityId;

      const currentUserInfo = await CommunityEntity.createQueryBuilder(
        "community"
      )
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .leftJoinAndSelect("communityMember.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      const isRank = currentUserInfo.communityMember[0].rank;

      if (isRank === "master" || isRank === "manager") {
        await createQueryBuilder()
          .update(CommunityEntity)
          .set({
            ...data,
          })
          .where("id = :id", { id: communityId })
          .execute();

        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("updateCommunity Error :", e);
      return false;
    }
  }

  //master계정의 경우라면,
  //아예 커뮤니티를 폐쇄 시키거나, 커뮤니티를 삭제하는 로직이 발생해야함
  //이에 따른 문제 제기로는 1) 커뮤니티는 폐쇄기능이 존재하는데 해당 폐쇄기능은 완전히 커뮤니티를 삭제하는 개념인지, 아니면 보였졌다 말았다하는 개념인지
  @Mutation(() => Boolean)
  //커뮤니티 폐쇄
  async communityClosing(
    @Ctx() ctx: Context,
    @Arg("data") data: CommunityClosingUpdateInput,
    @Arg("where") where: CommunityInfoWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const communityId = where.communityId;

      await createQueryBuilder()
        .update(CommunityEntity)
        .set({
          ...data,
        })
        .where("id = :id", { id: communityId })
        .execute();

      return true;
    } catch (e) {
      console.log("communityClosing Error :", e);
      return false;
    }
  }

  @Query(() => [CommunityObject])
  //최근 커뮤니티를 보여주는 query
  async communityRecentlyList(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const recentCommunityList = await CommunityEntity.createQueryBuilder(
        "community"
      )
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .where(
          "communityMember.rank = 'master' OR communityMember.rank = 'manager'"
        )
        .orderBy("community.createdDate", "DESC")
        .limit(3)
        .getMany();

      // [ { check: '가입됨' }, { check: '가입됨' }, { check: '신청' } ] 와 같은 내용을 담기위함
      let filterRecentCommunityList = [];

      //recentCommunityList의 값에 filterRecentCommunityList를 합친다
      let mergeRecentlyCommunityListArr = [];

      const mapFilterRecentCommunityList = recentCommunityList.map(
        async (item, index) => {
          const pushCommunity = await CommunityMemberEntity.createQueryBuilder(
            "communityMember"
          )
            .leftJoinAndSelect("communityMember.user", "user")
            .leftJoinAndSelect("communityMember.community", "community")
            .where("user.mrloginId = :mrloginId", { mrloginId })
            .andWhere("community.id = :id", { id: item.id })
            .getOne();

          if (pushCommunity?.isApprove === true) {
            let filterPushCommunity = { check: "가입됨" };
            filterRecentCommunityList.push(filterPushCommunity);
          } else if (pushCommunity?.isApprove === false) {
            let filterPushCommunity = { check: "신청됨" };
            filterRecentCommunityList.push(filterPushCommunity);
          } else {
            let filterPushCommunity = { check: "신청" };
            filterRecentCommunityList.push(filterPushCommunity);
          }
        }
      );

      await Promise.all(mapFilterRecentCommunityList);

      recentCommunityList.map((item, index) => {
        console.log("item.communityMember:", item.communityMember);
        filterRecentCommunityList.map((subItem, subIndex) => {
          if (index === subIndex) {
            mergeRecentlyCommunityListArr.push({
              communityItem: item,
              isCommunityMember: subItem,
              requestInfo: item.communityMember,
            });
          }
        });
      });

      console.log(
        "mergeRecentlyCommunityListArr: ",
        mergeRecentlyCommunityListArr
      );
      return mergeRecentlyCommunityListArr;
    } catch (e) {
      console.log("recentlyCommunityList Error: ", e);
      return null;
    }
  }

  @Query(() => [CommunityListObject])
  //내가 가입된 커뮤니티 List 와 내가 개설한 커뮤니티 List query
  async communityMyList(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityListType
  ) {
    try {
      const type = where.type;

      const mrloginId = ctx.user.userId;

      //내가 가입된 커뮤니티 List
      if (type === Type.JOINED) {
        const myJoinedCommunityList = await CommunityMemberEntity.createQueryBuilder(
          "communityMember"
        )
          .leftJoinAndSelect("communityMember.user", "user")
          .leftJoinAndSelect("communityMember.community", "community")
          .where("user.mrloginId = :mrloginId", { mrloginId })
          .andWhere("communityMember.isApprove = true")
          .andWhere("community.isClosed = false")
          .getMany();
        console.log("myJoinedCommunityList: ", myJoinedCommunityList);
        return myJoinedCommunityList;
      } else {
        //내가 생성한 커뮤니티 리스트
        const myCommunityList = await CommunityMemberEntity.createQueryBuilder(
          "communityMember"
        )
          .leftJoinAndSelect("communityMember.user", "user")
          .leftJoinAndSelect("communityMember.community", "community")
          .where("user.mrloginId = :mrloginId", { mrloginId })
          .andWhere("communityMember.rank = 'master'")
          .andWhere("communityMember.isApprove = true")
          .andWhere("community.isClosed = false")
          .getMany();
        console.log("myCommunityList: ", myCommunityList);
        return myCommunityList;
      }
    } catch (e) {
      console.log("myComminityList Error : ", e);
      return null;
    }
  }

  @Query(() => CommunityInfoObject)
  //특정 커뮤니티에 들어왔을때 게시글들 상단에 보여지는 해당 커뮤니티의 설명 및 커뮤니티 멤버들 수 query || 게시글 수정시 사용하는 query
  async communityInfo(@Arg("where") where: CommunityInfoWhereInput) {
    try {
      const communityId = where.communityId;

      const currentCommunity = await CommunityEntity.createQueryBuilder(
        "community"
      )
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .leftJoinAndSelect("communityMember.user", "user")
        .where("community.id = :id", { id: communityId })
        .andWhere("communityMember.isApprove = :isApprove", { isApprove: true })
        .getOne();

      return currentCommunity;
    } catch (e) {
      console.log("communityInfo Error:", e);
      return null;
    }
  }

  @Query(() => IsCommunityMemberObject)
  //해당 community에 내가 어떤 등급을 가진 멤버인지를 알기위한 query
  async isCommunityMember(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityInfoWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const communityId = where.communityId;

      const isCommunityMember = await CommunityEntity.createQueryBuilder(
        "community"
      )
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .leftJoinAndSelect("communityMember.user", "user")
        .leftJoinAndSelect("communityMember.community", "communityInfo")
        .where("communityInfo.id = :id", {
          id: communityId,
        })
        .andWhere("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      const rank = isCommunityMember?.communityMember[0].rank;
      const isApprove = isCommunityMember?.communityMember[0].isApprove;
      console.log("rank: ", rank);
      console.log("isApprove: ", isApprove);

      if (rank === "master") {
        return { check: "master", isApprove: isApprove };
      } else if (rank === "manager") {
        return { check: "manager", isApprove: isApprove };
      } else if (rank === "user") {
        return { check: "user", isApprove: isApprove };
      } else {
        return false;
      }
    } catch (e) {
      console.log("isCommunityMember: ", e);
      return false;
    }
  }

  @Query(() => [SearchCommunityListObject])
  //커뮤니티 검색 query입니다.
  async searchCommunityList(@Arg("where") where: CommunityTermWhereInput) {
    try {
      const term = where.term;
      const searchCommunityList = await CommunityEntity.createQueryBuilder(
        "community"
      )
        .leftJoinAndSelect("community.communityMember", "communityMember")

        .andWhere("community.title ILIKE :title", { title: `%${term}%` })
        .andWhere("community.isClosed = false")
        .getMany();

      console.log("test: ", searchCommunityList);

      return searchCommunityList;
    } catch (e) {
      console.log("searchCommunityList Error: ", e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  //커뮤니티를 삭제하는 mutation
  async deleteCommunity(
    @Ctx() ctx: Context,
    @Arg("where") where: CommunityDeleteInput
  ) {
    try {
      // const userId = 1;
      const mrloginId = ctx.user.userId;
      const communityId = where.communityId;
      console.log("communityId: ", communityId);

      const findCommunity = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.user", "user")
        .where("communityMember.community = :community", {
          community: communityId,
        })
        .andWhere("communityMember.rank = 'master'")
        .getOne();

      if (mrloginId === findCommunity.user[0].mrloginId) {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(CommunityEntity)
          .where("id = :id", { id: communityId })
          .execute();
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(CommunityMemberEntity)
          .where("id = :id", { id: communityId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("deleteComunnity Error: ", e);
      return false;
    }
  }
}
