import { Field, InputType } from "type-graphql";

enum Type {
  POST = "post",
  COMMENT = "comment",
}

enum ReportCategory {
  SPAM = "spam",
  IMPERSONATE = "impersonate",
  HAZARDOUSCONTENT = "Hazardous_content",
  ETC = "etc",
}

@InputType()
export class ReportCreateInput {
  @Field()
  type: Type;

  @Field()
  category: ReportCategory;

  @Field()
  email: string;

  @Field()
  reporter: number;

  @Field()
  reported: number;

  @Field({ nullable: true })
  communityPostId: number;

  @Field({ nullable: true })
  communityPostCommentId: number;

  @Field()
  description: string;
}
