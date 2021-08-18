import { Context } from "server/express";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { StepWorkingEnity } from "../entities/StepWorking.entity";
import { StepWorkingCreateInput } from "../inputs/StepWorkingCreateWhereInput.input";

@Resolver()
export class StepWorkingResolver {
  @Query(() => Boolean)
  async stepWorkingIsTodayRegister(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      var date = new Date();
      var year = date.getFullYear();
      var month = ("0" + (1 + date.getMonth())).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);

      const customToDayDate = `${year + "/" + month + "/" + day}`;

      const custumTodayMidnightDate = new Date(customToDayDate);

      const isTodayRegister = await StepWorkingEnity.createQueryBuilder(
        "stepWorking"
      )
        .leftJoinAndSelect("stepWorking.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere(`stepWorking.createdDate = :createdDate`, {
          createdDate: custumTodayMidnightDate,
        })
        .getOne();

      if (!isTodayRegister) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("stepWorkingIsTodayRegister Error:", e);
      return false;
    }
  }
  @Mutation(() => Boolean)
  //전체 유저의 포인트 리스트를 의미합니다
  async createStepWorking(
    @Ctx() ctx: Context,
    @Arg("data") data: StepWorkingCreateInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      var date = new Date();
      var year = date.getFullYear();
      var month = ("0" + (1 + date.getMonth())).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);

      const customToDayDate = `${year + "/" + month + "/" + day}`;

      const custumTodayMidnightDate = new Date(customToDayDate);

      await StepWorkingEnity.create({
        user: { mrloginId },
        stepCount: data.stepWorking,
        createdDate: custumTodayMidnightDate,
      }).save();

      return true;
    } catch (e) {
      console.log("createStepWorking Error: ", e);
      return false;
    }
  }
}
