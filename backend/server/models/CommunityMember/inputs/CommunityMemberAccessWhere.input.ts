import { Field, InputType } from "type-graphql";

enum Type {
  ACCESS = "access",
  CANCEL = "cancel",
}

@InputType()
export class CommunityMemberAccessWhereInput {
  @Field()
  communityMemberId: number;

  @Field()
  type: Type;
}
