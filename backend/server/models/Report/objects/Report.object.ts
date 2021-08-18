import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ReportObject {
  @Field()
  id: number;

  @Field()
  kind: string;

  @Field()
  reporter: number;

  @Field()
  reporterEmail: string;

  @Field()
  reported: number;

  @Field({ defaultValue: null })
  communityPostId: number;

  @Field({ defaultValue: null })
  communityPostCommentId: number;

  @Field()
  content: string;

  @Field()
  blockingStatus: boolean;

  @Field()
  createdDate: Date;
}
