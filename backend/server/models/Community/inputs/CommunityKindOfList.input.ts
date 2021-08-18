import { Field, InputType } from "type-graphql";

enum Type {
  JOINED = "joined",
  MYCOMMUNITY = "mycommunity",
}

@InputType()
export class CommunityListType {
  @Field()
  type: Type;
}
