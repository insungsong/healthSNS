import { Context } from "server/express";
import { UserEntity } from "../../User/entities/User.entity";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreditEntity } from "../entities/Credit.entity";
import { createQueryBuilder } from "typeorm";
import { CreditCreateInput } from "../inputs/CreditCreate.input";
import { CreditObject } from "../objects/Credit.object";

@Resolver()
export class CreditResolver {
  @Mutation(() => Boolean)
  //credit을 생성하는 mutation
  async createCredit(
    @Ctx() ctx: Context,
    @Arg("data") data: CreditCreateInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const kindOfReson = data.reason;
      const kindOfPointValue = data.score;

      const userInfo = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();

      console.log("userInfo: ", userInfo);
      const creditPoint = userInfo.creditScore;

      const stackCreditPoint = creditPoint + kindOfPointValue;

      if (110 >= stackCreditPoint) {
        await CreditEntity.create({
          user: {
            mrloginId,
          },
          creditScore: kindOfPointValue,
          reason: kindOfReson,
        }).save();

        await createQueryBuilder()
          .update(UserEntity)
          .set({ creditScore: () => `"creditScore" + ${kindOfPointValue}` })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      } else {
        await CreditEntity.create({
          user: {
            mrloginId,
          },
          creditScore: kindOfPointValue,
          reason: kindOfReson,
        }).save();

        await createQueryBuilder()
          .update(UserEntity)
          .set({ creditScore: () => `${110}` })
          .where("mrloginId = :mrloginId", { mrloginId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("createCreadit Error: ", e);
      return false;
    }
  }

  @Query(() => CreditObject)
  async myCreditScore(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const userCreditInfo = await UserEntity.createQueryBuilder("user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .getOne();
      console.log("userCreditInfo: ", userCreditInfo);
      return userCreditInfo;
    } catch (e) {
      console.log("myCreditHistory Error: ", e);
      return null;
    }
  }
  @Query(() => [CreditObject])
  async myCreditHistory(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      const creditHistory = await CreditEntity.createQueryBuilder("credit")
        .leftJoinAndSelect("credit.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .orderBy("credit.createdDate", "DESC")
        .getMany();

      let stackHistory = [];

      const stackHistoryProcess = creditHistory.map((item) => {
        stackHistory.push({
          id: item.id,
          reason: item.reason,
          creditScore: item.creditScore,
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
