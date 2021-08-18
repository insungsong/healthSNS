import { tryGetPreviewData } from "next/dist/next-server/server/api-utils";
import { Context } from "server/express";
import { CommunityPostEntity } from "../../CommunityPost/entities/CommunityPost.entity";
import { CommunityPostCommentEntity } from "../../CommunityPostComment/entities/CommunityPostComment.entity";
import { UserEntity } from "../../User/entities/User.entity";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection } from "typeorm";
import { ReportEntity } from "../entities/Report.entity";
import { ReportCreateInput } from "../inputs/ReportCreate.input";
import { ReportUpdateDataInput } from "../inputs/ReportUpdateData.input";
import { ReportUpdateWhereInput } from "../inputs/ReportUpdateWhere.input";
import { ReportObject } from "../objects/Report.object";

//신고의 종류를 의미합니다
enum Type {
  POST = "post",
  COMMENT = "comment",
}

//신고 확정과 신고 철회를 의미합니다.
enum ReportConfirmType {
  CONFIRM = "confirm",
  CANCEL = "cancel",
}

@Resolver()
export class ReportResolver {
  @Mutation(() => Boolean)
  //댓글 신고와 커뮤니티 게시글 신고에 사용되는 mutation이다.
  async createReport(
    @Ctx() ctx: Context,
    @Arg("data") data: ReportCreateInput
  ) {
    try {
      console.log("ctx.user: ", ctx.user);
      const mrloginId = ctx.user.userId;

      const type = data.type;
      const category = data.category;

      if (type === Type.POST) {
        await ReportEntity.create({
          communityPostId: data.communityPostId,
          type,
          reporter: mrloginId,
          email: data.email,
          category,
          //신고당하는 사람 id
          reported: data.reported,
          description: data.description,
        }).save();
      } else {
        await ReportEntity.create({
          communityPostCommentId: data.communityPostCommentId,
          type,
          reporter: mrloginId,
          email: data.email,
          //신고당하는 사람 id
          category,
          reported: data.reported,
          description: data.description,
        }).save();
      }

      return true;
    } catch (e) {
      console.log("createReport Error: ", e);
      return false;
    }
  }

  //신고리스트 보기
  @Query(() => [ReportObject])
  async reportList() {
    try {
      const reportList = await ReportEntity.createQueryBuilder(
        "report"
      ).getMany();

      console.log("reportList: ", reportList);
      return reportList;
    } catch (e) {
      console.log("reportList Error: ", e);
      return null;
    }
  }

  //신고리스트에서 신고 확정 및 취소시키기
  @Mutation(() => Boolean)
  async updateReport(
    @Arg("data") data: ReportUpdateDataInput,
    @Arg("where") where: ReportUpdateWhereInput
  ) {
    try {
      const reportId = where.reportId;
      //TO DO: reportId로 해당 신고 id를 찾은 후 reportId가 아닌 신고된 게시글의 id를 넣어주어야한다.

      const currentReportInfoProcessing = ReportEntity.createQueryBuilder(
        "report"
      ).where("id = :id", { id: reportId });

      //신고 자체를 확정할것인지에 따른 코드
      const reportConfirmType = where.reportConfirmType;

      //신고를 확정할 경우
      if (reportConfirmType === ReportConfirmType.CONFIRM) {
        //해당 신고 당한 id가 신고처리됨
        await createQueryBuilder()
          .update(ReportEntity)
          .set({
            blockingStatus: data.blockingStatus,
            isChecked: true,
          })
          .where("id = :id", { id: reportId })
          .execute();

        const reportInfo = await currentReportInfoProcessing.getOne();

        //신고로 들어온 게시글이 post일 경우
        if (reportInfo.type === Type.POST) {
          //신고가 확정된 경우 communityPost isVisble이 변경되어야한다.
          await createQueryBuilder()
            .update(CommunityPostEntity)
            .set({
              isVisble: false,
            })
            .where("id = :id", { id: reportInfo.communityPostId })
            .execute();
        } else {
          //신고 확정으로 된 댓글인경우
          await createQueryBuilder()
            .update(CommunityPostCommentEntity)
            .set({
              isVisble: false,
            })
            .where("id = :id", { id: reportInfo.communityPostCommentId })
            .execute();
        }
      } else {
        //신고 철회할 경우
        await createQueryBuilder()
          .update(ReportEntity)
          .set({
            isChecked: true,
          })
          .where("id = :id", { id: reportId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("updateReport Error: ", e);
      return false;
    }
  }
}
