import { Context } from "server/express";
import { UserEntity } from "../../User/entities/User.entity";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection } from "typeorm";
import { PhoneNumberListEntity } from "../entities/PhoneNumberList.entity";
import { PhoneNumberListCreateInput } from "../inputs/PhoneNumberListCreate.input";
import { PhoneNumberListObject } from "../objects/PhoneNumberList.object";
import { PhoneNumberListWhereInput } from "../inputs/PhoneNumberListWhere.input";
import { PhoneNumberListUpdateWhereInput } from "../inputs/PhoneNumberListUpdateWhere.input";
import { sendSMS } from "../../../lib/nhnToast";

/**
 * User 와 관련된 요청을 처리합니다.
 *
 * @author BounceCode, Inc.
 */
@Resolver()
export class PhoneNumberListResolver {
  @Query(() => Boolean)
  //내 초대 휴대전화번호부 초대리스트에서 내가 초대한 유저는 보여주면 안됨으로 return false를 return하게 하는 코드입니다.
  async phoneNumberIsInviteUser(
    @Ctx() ctx: Context,
    @Arg("where") where: PhoneNumberListUpdateWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const phoneNumberId = where.id;

      const currentMyPhoneNumberIsInviteUser = await PhoneNumberListEntity.createQueryBuilder(
        "phoneNumberList"
      )
        .where("phoneNumberList.userId = :userId", { userId: mrloginId })
        .andWhere("phoneNumberList.id = :id", { id: phoneNumberId })
        .getOne();

      if (currentMyPhoneNumberIsInviteUser.isInvited) {
        //내가 이미 초대한 사람이라면 false
        return false;
      } else {
        //내가 이미 초대한 사람아니라면 true
        return true;
      }
    } catch (e) {
      console.log("isInviteUser Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //유저가 본인의 휴대전화번호부에서 초대할 리스트들 중 초대버튼을 눌렀을때 일어나는 mutation
  async updateInvitePhoneNumberList(
    @Ctx() ctx: Context,
    @Arg("where") where: PhoneNumberListUpdateWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;
      const updateInvitePhoneNumberId = where.id;

      const phoneNumberData = await PhoneNumberListEntity.findOne({
        id: updateInvitePhoneNumberId,
      });

      console.log("phoneNumberData: ", phoneNumberData);

      const updateMutation = await createQueryBuilder()
        .update(PhoneNumberListEntity)
        .set({
          isInvited: true,
        })
        .where("id = :id", { id: updateInvitePhoneNumberId })
        .andWhere("userId = :userId", { userId: mrloginId })
        .execute();

      await sendSMS({
        body: `9988 어플리케이션의 초대장입니다.`,
        recipientNo: phoneNumberData?.phoneNumber,
      });

      console.log("updateMutation: ", updateMutation);

      return true;
    } catch (e) {
      console.log("createInvitePhoneNumberList Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //내 전화번호부 동의를 통해서, PhoneNumberListEntity에 row를 생성함
  async createPhoneNumberList(
    @Ctx() ctx: Context,
    @Arg("data") data: PhoneNumberListCreateInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      // await getConnection()
      //   .createQueryBuilder()
      //   .delete()
      //   .from(PhoneNumberListEntity)
      //   .where("userId = :userId", { userId: mrloginId })
      //   .execute();

      const phoneNumberListArr = data?.phoneNumberInfo;
      console.log("✅ phoneNumberListArr: ", phoneNumberListArr);

      phoneNumberListArr.map(async (phoneNumberInfo) => {
        console.log("phoneNumberInfo: ", phoneNumberInfo);
        //userEntity에 해당 phoneNumber를 가진 유저 정보가 있는지 확인해서 없으면 phoneNumberListEntity에 넣는다.
        const currentUser = await PhoneNumberListEntity.createQueryBuilder(
          "phoneNumberList"
        )
          .where("phoneNumberList.phoneNumber = :phoneNumber", {
            phoneNumber: phoneNumberInfo.phoneNumber,
          })
          .andWhere("phoneNumberList.userId = :userId", { userId: mrloginId })
          .getOne();

        console.log("currentUser: ", currentUser);

        if (!currentUser) {
          await PhoneNumberListEntity.create({
            userId: mrloginId,
            phoneNumber: phoneNumberInfo.phoneNumber,
            phoneName: phoneNumberInfo.phoneName,
          }).save();
        }
      });

      return true;
    } catch (e) {
      console.log("createInvite Error: ", e);
      return false;
    }
  }

  @Query(() => [PhoneNumberListObject])
  //내 전화번호부에 저장된 유저리스트 이름과 폰번호를 조회하고 그 배열정보에 각각의 배열 요소마다 연결된 전화번호를 통해 친구 수를 합친 나의 전화번호부 리스트 정보
  async myPhoneNumberList(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const myPhoneNumberList = await PhoneNumberListEntity.createQueryBuilder(
        "phoneNumber"
      )
        .where("phoneNumber.userId = :userId", { userId: mrloginId })
        .andWhere("phoneNumber.isInvited = :isInvited", { isInvited: false })
        .getMany();

      let pushFriendInfoMyPhoneNumberList = [];

      const result = myPhoneNumberList.map(async (user) => {
        const friendInfoLengthOfCurrentUser = await PhoneNumberListEntity.createQueryBuilder(
          "phoneNumberList"
        )
          .where("phoneNumberList.phoneNumber = :phoneNumber", {
            phoneNumber: user.phoneNumber,
          })
          .getMany();

        let mergeUserInfo = {
          ...user,
          friendCount: friendInfoLengthOfCurrentUser.length,
        };

        pushFriendInfoMyPhoneNumberList.push(mergeUserInfo);
      });

      await Promise.all(result);

      console.log(
        "✅ pushFriendInfoMyPhoneNumberList: ",
        pushFriendInfoMyPhoneNumberList
      );

      return pushFriendInfoMyPhoneNumberList;
    } catch (e) {
      console.log();
      return null;
    }
  }

  @Mutation(() => Boolean)
  //해당 유저의 전화번호부를 업데이트 할때 쓰이는 mutation
  async updatePhoneNumberList(
    @Ctx() ctx: Context,
    @Arg("data") data: PhoneNumberListCreateInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(PhoneNumberListEntity)
        .where("userId = :userId", { userId: mrloginId })
        .execute();

      const phoneNumberListArr = data?.phoneNumberInfo;

      phoneNumberListArr.map(async (phoneNumberInfo) => {
        await PhoneNumberListEntity.create({
          userId: mrloginId,
          phoneNumber: phoneNumberInfo.phoneNumber,
          phoneName: phoneNumberInfo.phoneName,
        }).save();
      });

      return true;
    } catch (e) {
      console.log("updatePhoneNumber Error:", e);
      return false;
    }
  }

  @Query(() => [PhoneNumberListObject])
  //나의 초대하기 list에서 검색한 user또는 users를 보여주는 것
  async searchPhoneNumberList(
    @Ctx() ctx: Context,
    @Arg("where") where: PhoneNumberListWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const phoneName = where.phoneName;

      const searchPhoneNumberList = await PhoneNumberListEntity.createQueryBuilder(
        "phoneNumberList"
      )
        .where("phoneNumberList.userId = :userId", { userId: mrloginId })
        .andWhere("phoneNumberList.isInvited = :isInvited", {
          isInvited: false,
        })
        .andWhere("phoneNumberList.phoneName ILIKE :phoneName", {
          phoneName: `%${phoneName}%`,
        })
        .getMany();

      let pushFriendInfoMyPhoneNumberList = [];

      const result = searchPhoneNumberList.map(async (user) => {
        const friendInfoLengthOfCurrentUser = await PhoneNumberListEntity.createQueryBuilder(
          "phoneNumberList"
        )
          .where("phoneNumberList.phoneNumber = :phoneNumber", {
            phoneNumber: user.phoneNumber,
          })
          .getMany();

        let mergeUserInfo = {
          ...user,
          friendCount: friendInfoLengthOfCurrentUser.length,
        };

        pushFriendInfoMyPhoneNumberList.push(mergeUserInfo);
      });

      await Promise.all(result);

      return pushFriendInfoMyPhoneNumberList;
    } catch (e) {
      console.log("searchPhoneNumberList:", e);
      return null;
    }
  }

  @Query(() => [PhoneNumberListObject])
  //내가 초대버튼을 누른 List
  async invitedPhoneNumberList(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const myPhoneNumberList = await PhoneNumberListEntity.createQueryBuilder(
        "phoneNumber"
      )
        .where("phoneNumber.userId = :userId", { userId: mrloginId })
        .andWhere("phoneNumber.isInvited = :isInvited", { isInvited: true })
        .getMany();

      return myPhoneNumberList;
    } catch (e) {
      console.log("invitedPhoneNumberList: ", e);
      return null;
    }
  }
}
