import { Field, InputType } from "type-graphql";

enum PostCreateType {
  COMMUNITY = "community",
  ALL = "all",
}
@InputType()
export class PostCreateTypeWhereInput {
  @Field()
  type: PostCreateType;

  //전체공개일 경우에는 communityId가 필요 없음으로 nullable:true로 한다
  @Field({ nullable: true })
  communityId: number;
}
