/**
 * User 에 대한 Model 입니다.
 *
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.resolvers
 * @preferred
 */

import { Resolver, Query, Mutation, Ctx, Arg, Int, Args } from "type-graphql";
import { UserEntity } from "../entities/User.entity";
import { UserMergeObject, UserObject } from "../objects/User.object";
import { UserCreateInput } from "../inputs/UserCreate.input";
import { Context } from "../../../express";
import { ApolloError } from "apollo-server-express";
import removeEmpty from "../../../lib/removeEmpty";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { UserUpdateInput } from "../inputs/UserUpdate.input";
import { UserWhereInput } from "../inputs/UserWhere.input";
import { PhoneNumberListEntity } from "../../PhoneNumberList/entities/PhoneNumberList.entity";
import { HelpYouWhereInput } from "../inputs/HelpYouWhere.input";
import { HelpYouUpdateWhereInput } from "../inputs/HelpYouCreateWhere.input";
import { UserInviteMeUpdateWhereInput } from "../inputs/UserInviteMeUpdateWhere.input";
import { SearchHelpYouWhereInput } from "../inputs/SearchHelpYouWhereInput.input";
import { createNotification } from "../../Notification/service/notification.service";
import { NOTIFICATION_CATEGORY } from "../../Notification/entities/Notification.entity";
import { MrloginUserLoginInput } from "../inputs/MrloginUserLogin.input";
import { QueryStore } from "apollo-client/data/queries";
import { BlockUserListDataInput } from "../inputs/BlockUserListData.input";
import { allowedNodeEnvironmentFlags } from "process";
/**
 * User 와 관련된 요청을 처리합니다.
 *
 * @author BounceCode, Inc.
 */
@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  //전화번호부 인증 완료시 UserEntity의 inviteMe가 생성되어야하는데 이에 따른 mutation
  async userInviteMeUpdate(
    @Ctx() ctx: Context,
    @Arg("where") where: UserInviteMeUpdateWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const phoneNumber = where.phoneNumber;

      //나를 초대한 사람이 a,b라고 할때 b라는 사람이 제일 마지막에 초대한 사람이다. b가 나의 userEntity - invitedMe로 연결되도록 로직을 구성함
      const myInvitedInfo = await PhoneNumberListEntity.createQueryBuilder(
        "phoneNumberList"
      )
        .where("phoneNumberList.isInvited = true")
        .andWhere("phoneNumberList.phoneNumber = :phoneNumber", {
          phoneNumber: phoneNumber,
        })
        .orderBy("phoneNumberList.createdDate", "DESC")
        .getOne();

      const invitedMe = myInvitedInfo.userId;

      await createQueryBuilder()
        .update(UserEntity)
        .set({
          invitedMe,
          phoneNumber,
        })
        .where("mrloginId = :mrloginId", { mrloginId })
        .execute();

      return true;
    } catch (e) {
      console.log("userInviteMeUpdate Error: ", e);
      return false;
    }
  }
  @Mutation(() => UserObject)
  async createUser(@Arg("data") data: UserCreateInput) {
    try {
      return await UserEntity.create(data).save();
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => Boolean)
  //로그인 버튼 클릭시, 미스터 로그인으로 부터 받아온 토큰 정보가 9988서버 UserEntity로 있는지 확인하여 있다면 로그인 ,없다면 유저 생성 시키는 mutation
  async mrLoginUserLogin(@Ctx() ctx: Context) {
    try {
      console.log("mrLoginUserLogin User Data: ", ctx?.user);
      const mrloginId = ctx?.user?.userId;
      const mrloginToken = ctx?.user;

      console.log("mrloginToken: ", mrloginToken);

      const user = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      if (!user) {
        //미스터 로그인 토큰 정보가 userEntity에 없다면
        try {
          await UserEntity.create({
            mrloginId,
            phoneNumber: mrloginToken?.phoneNumber,
            email: mrloginToken?.email,
          }).save();
        } catch (e) {
          console.log("하,,,: ", e);
        }
      } else {
        const userPhoneNumberListInfo = await PhoneNumberListEntity.createQueryBuilder(
          "phoneNumberList"
        )
          .where("phoneNumberList.phoneNumber = :phoneNumber", {
            phoneNumber: mrloginToken?.phoneNumber,
          })
          .andWhere("phoneNumberList.isInvited = true")
          .getOne();

        console.log("🔑 userPhoneNumberListInfo: ", userPhoneNumberListInfo);

        const user = await UserEntity.createQueryBuilder("user")
          .where("user.mrloginId = :mrloginId", { mrloginId })
          .getOne();

        const isInvitedMe = user?.isInvite;

        if (!isInvitedMe) {
          await createQueryBuilder()
            .update(UserEntity)
            .set({
              phoneNumber: mrloginToken?.phoneNumber,
              email: mrloginToken?.email,
              isInvite: userPhoneNumberListInfo?.isInvited,
              invitedMe: userPhoneNumberListInfo?.userId,
            })
            .where("mrloginId = :mrloginId", { mrloginId })
            .execute();
        } else {
          await createQueryBuilder()
            .update(UserEntity)
            .set({
              phoneNumber: mrloginToken?.phoneNumber,
              email: mrloginToken?.email,
              isInvite: userPhoneNumberListInfo?.isInvited,
            })
            .where("mrloginId = :mrloginId", { mrloginId })
            .execute();
        }
      }

      return true;
    } catch (e) {
      console.log("mrLoginUserLogin Error:", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async updatePhoneNumber(@Ctx() ctx: Context) {
    try {
      const user = ctx?.user;

      await createQueryBuilder()
        .update(UserEntity)
        .set({ phoneNumber: user?.phoneNumber })
        .where("mrloginId = :mrloginId", { mrloginId: user.userId })
        .execute();

      return true;
    } catch (e) {
      console.log("updatePhoneNumber Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //회원 가입된 유저의 정보를 업데이트하는 mutation
  async updateUser(@Ctx() ctx: Context, @Arg("data") data: UserUpdateInput) {
    try {
      const mrloginId = ctx.user.userId;
      const user = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      if (user) {
        await createQueryBuilder()
          .update(UserEntity)
          .set({ ...data })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("createUserInfoUpdate Error:", e);
      return false;
    }
  }

  @Query(() => UserMergeObject)
  //유저 상세보기 조회를 의미합니다
  async me(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const user = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();
      console.log("user: ", user);

      //나를 초대한 사람의 id
      const inviteUserId = user.invitedMe;

      if (inviteUserId) {
        //나를 초대한 사람의 정보를 알기위한 query
        const inviteUser = await UserEntity.createQueryBuilder("user")
          .where("user.mrloginId = :mrloginId", { mrloginId: inviteUserId })
          .getOne();
        console.log("inviteUser: ", inviteUser);

        //해당하는 userId와 해당 유저를 초대한 유저의 id로 생성된 phoneNumberEntity의 updateDate시간을 가져와야한다
        const inviteInfo = await PhoneNumberListEntity.createQueryBuilder(
          "phoneNumberList"
        )
          .where("phoneNumberList.userId = :userId", { userId: inviteUserId })
          .andWhere("phoneNumberList.phoneNumber = :phoneNumber", {
            phoneNumber: user?.phoneNumber,
          })
          .getOne();

        console.log("inviteInfo: ", inviteInfo);

        const inviteDate = inviteInfo?.updatedDate;

        const mergeObject = { user, invitedUser: inviteUser, inviteDate };

        //TO DO: 나의 관심분야의 경우에는 mrlogin의 token안에 들어있을 정보입니다.
        return mergeObject;
      } else {
        const mergeObject = { user };

        //TO DO: 나의 관심분야의 경우에는 mrlogin의 token안에 들어있을 정보입니다.
        return mergeObject;
      }
    } catch (e) {
      console.log("me Error: ", e);
      return null;
    }
  }

  @Query(() => UserMergeObject)
  //유저 상세보기 조회를 의미합니다
  async user(@Arg("where") where: UserWhereInput) {
    try {
      const mrloginId = where.id;

      const user = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      console.log("user: ", user);

      //나를 초대한 사람의 id
      const inviteUserId = user.invitedMe;

      if (!inviteUserId) {
        //나를 초대한 사람의 정보를 알기위한 query

        //TO DO:
        //TO DO: 나의 관심분야의 경우에는 mrlogin의 token안에 들어있을 정보입니다.
        const mergeObject = { user, invitedUser: null };

        return mergeObject;
      } else {
        //나를 초대한 사람의 정보를 알기위한 query
        const inviteUser = await UserEntity.createQueryBuilder("user")
          .where("user.mrloginId = :mrloginId", { mrloginId: inviteUserId })
          .getOne();

        console.log("inviteUser:", inviteUser);

        //해당하는 userId와 해당 유저를 초대한 유저의 id로 생성된 phoneNumberEntity의 updateDate시간을 가져와야한다
        const inviteInfo = await PhoneNumberListEntity.createQueryBuilder(
          "phoneNumberList"
        )
          .where("phoneNumberList.userId = :userId", { userId: inviteUserId })
          .andWhere("phoneNumberList.phoneNumber = :phoneNumber", {
            phoneNumber: user.phoneNumber,
          })
          .getOne();

        const inviteDate = inviteInfo.updatedDate;

        const mergeObject = { user, invitedUser: inviteUser, inviteDate };

        //TO DO:
        //TO DO: 나의 관심분야의 경우에는 mrlogin의 token안에 들어있을 정보입니다.
        return mergeObject;
      }
    } catch (e) {
      console.log("user Error: ", e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  //헬프유를 하거나 취소하는 mutation
  async updateHelpYou(
    @Ctx() ctx: Context,
    @Arg("where") where: HelpYouUpdateWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const isHelpYou = where.isHelpYou;

      //내가 도움을 주기위해 help You한 유저 id
      const helpedYouId = where.id;

      const helpedYou = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId: helpedYouId })
        .getOne();

      if (!isHelpYou) {
        //내가 헬프유 하지 않았다면 -> 헬프유함
        await getConnection()
          .createQueryBuilder()
          .relation(UserEntity, "behelpedYou")
          .of(helpedYou)
          .add(mrloginId);

        await createNotification({
          requester: mrloginId,
          receiver: helpedYouId,
          type: NOTIFICATION_CATEGORY.HELPYOU,
        });
      } else {
        //내가 헬프유 했다면 -> 취소
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from("helpyou_behelpedyou")
          .where("userEntityMrloginId_1 = :userEntityMrloginId_1", {
            userEntityMrloginId_1: mrloginId,
          })
          .andWhere("userEntityMrloginId_2 = :userEntityMrloginId_2", {
            userEntityMrloginId_2: helpedYouId,
          })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("createHelpYou Error: ", e);
      return false;
    }
  }

  @Query(() => Boolean)
  //helpyou를 했는지 확인하는 query
  async isHelpYou(@Ctx() ctx: Context, @Arg("where") where: HelpYouWhereInput) {
    try {
      const mrloginId = ctx.user.userId;

      const helpYouId = where.helpYouId;

      const isHelpYou = await UserEntity.createQueryBuilder("user")
        .leftJoinAndSelect("user.helpYou", "helpYou")
        // .leftJoinAndSelect("user.behelpedYou", "behelpedYou")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere("helpYou.mrloginId = :helpYouId", { helpYouId })
        .getOne();

      if (isHelpYou) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("isHelpYou Error: ", e);
      return false;
    }
  }

  @Query(() => [UserObject])
  //찾아보기 - 유저 클릭시 나오는 query
  async searchHelpYouUser(@Arg("where") where: SearchHelpYouWhereInput) {
    try {
      const term = where.term;

      const userList = await UserEntity.createQueryBuilder("user")
        .leftJoinAndSelect("user.behelpedYou", "behelpedYou")
        .where("user.name ILIKE :name", { name: `%${term}%` })
        .getMany();

      console.log("userList: ", userList);
      return userList;
    } catch (e) {
      console.log("searchHelpYouUser: ", e);
      return null;
    }
  }

  @Query(() => UserObject)
  //내 정보를 가지고 누가 나를 헬프유하고 누가 나를 헬프드유하는지를 보여주는 정보
  //이 정보를 가지고 나오는 배열 length를 가지고 카운트를 하도록 한다.
  async helpYouInfo(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const helpCountInfo = await UserEntity.createQueryBuilder("user")
        .leftJoinAndSelect("user.helpYou", "helpYou")
        .leftJoinAndSelect("user.behelpedYou", "behelpedYou")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      console.log("helpCountInfo: ", helpCountInfo);

      return helpCountInfo;
    } catch (e) {
      console.log("helpCountInfo Error: ", e);
      return null;
    }
  }

  @Query(() => [UserObject])
  async blockUserList(@Arg("data") data: BlockUserListDataInput) {
    try {
      const { blockUserList } = data;

      let blockUserListArr = [];

      const blockUserListProcessing = blockUserList?.map(async (userId) => {
        const currentBlockUser = await UserEntity.createQueryBuilder("user")
          .where("user.mrloginId = :mrloginId", { mrloginId: userId })
          .getOne();

        console.log("currentBlockUser: ", currentBlockUser);
        if (!!currentBlockUser) {
          blockUserListArr.push(currentBlockUser);
        }
      });

      await Promise.all(blockUserListProcessing);

      return blockUserListArr;
    } catch (e) {
      console.log("blockUserList Error: ", e);
      return null;
    }
  }
}
