import { Context } from "server/express";
import { UserEntity } from "../../User/entities/User.entity";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { PointEntity } from "../entities/Point.entity";
import { PointCreateInput } from "../inputs/PointCreate.input";
import { PointObject } from "../objects/Point.object";
import { PointHistoryObject } from "../objects/PointHistory.object";

enum PointReason {
  WORKING = "working",
  INFORMATION = "information",
  REINFORMATION = "reinformation",
  SHAREINFORMATION_SUBSCRIPTION_COUNT = "shareinformation_subscription_count",
}

enum PointValue {
  WORKING_POINT = 1,
  INFORMATION_POINT = 100,
  RE_INFORMATION_POINT = 10,
  SHARE_INFORMATION_SUBSCRIPTION_COUNT_POINT = 1,
}
@Resolver()
export class PointResolver {
  @Mutation(() => Boolean)
  //credit을 생성하는 mutation
  async createPoint(@Ctx() ctx: Context, @Arg("data") data: PointCreateInput) {
    try {
      const mrloginId = ctx.user.userId;

      const kindOfReson = data.reason;

      if (kindOfReson === PointReason.WORKING) {
        await PointEntity.create({
          user: {
            mrloginId,
          },
          reason: kindOfReson,
          pointScore: PointValue.WORKING_POINT,
        }).save();

        await createQueryBuilder()
          .update(UserEntity)
          .set({
            pointScore: () => `"pointScore" + ${PointValue.WORKING_POINT}`,
          })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      } else if (kindOfReson === PointReason.INFORMATION) {
        await PointEntity.create({
          user: {
            mrloginId,
          },
          reason: kindOfReson,
          pointScore: PointValue.INFORMATION_POINT,
        }).save();

        await createQueryBuilder()
          .update(UserEntity)
          .set({
            pointScore: () => `"pointScore" + ${PointValue.INFORMATION_POINT}`,
          })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      } else if (kindOfReson === PointReason.REINFORMATION) {
        await PointEntity.create({
          user: {
            mrloginId,
          },
          reason: kindOfReson,
          pointScore: PointValue.RE_INFORMATION_POINT,
        }).save();

        await createQueryBuilder()
          .update(UserEntity)
          .set({
            pointScore: () =>
              `"pointScore" + ${PointValue.RE_INFORMATION_POINT}`,
          })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      } else {
        await PointEntity.create({
          user: {
            mrloginId,
          },
          reason: kindOfReson,
          pointScore: PointValue.SHARE_INFORMATION_SUBSCRIPTION_COUNT_POINT,
        }).save();

        await createQueryBuilder()
          .update(UserEntity)
          .set({
            pointScore: () =>
              `"pointScore" + ${PointValue.SHARE_INFORMATION_SUBSCRIPTION_COUNT_POINT}`,
          })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("createCreadit Error: ", e);
      return false;
    }
  }
  @Query(() => PointObject)
  //나의 포인트를 조회 하는 쿼리
  async myPointInfo(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const myInfo = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      console.log("myInfo: ", myInfo);

      return myInfo;
    } catch (e) {
      console.log("myPointInfo: ", e);
      return null;
    }
  }

  @Query(() => [PointObject])
  //전체 유저의 포인트 리스트를 의미합니다
  async pointRankList() {
    try {
      const pointRankList = await UserEntity.createQueryBuilder("user")
        .orderBy("user.pointScore", "DESC")
        .limit(10)
        .getMany();

      console.log("pointRankList: ", pointRankList);
      return pointRankList;
    } catch (e) {
      console.log("pointRankList : ", e);
      return null;
    }
  }

  @Query(() => [PointHistoryObject])
  async myPointHistory(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const pointHistory = await PointEntity.createQueryBuilder("point")
        .leftJoinAndSelect("point.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .orderBy("point.createdDate", "DESC")
        .getMany();

      let stackHistory = [];

      const stackHistoryProcess = pointHistory.map((item) => {
        stackHistory.push({
          id: item.id,
          reason: item.reason,
          pointScore: item.pointScore,
          createdDate: item.createdDate,
        });
      });

      console.log("stackHistory: ", stackHistory);

      await Promise.all(stackHistoryProcess);

      return stackHistory;
    } catch (e) {
      console.log("myCreditHistory Error: ", e);
      return null;
    }
  }
}
