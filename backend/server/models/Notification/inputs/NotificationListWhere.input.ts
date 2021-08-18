import { Field, InputType } from "type-graphql";

enum NOTIFICATION_TYPE {
  ALL = "all",
  COMMUNITY = "community",
  HELPYOU = "helpYou",
  INFORMATION_COMMUNITY = "information_community",
}

@InputType()
export class NotificationListWhereInput {
  @Field()
  type: NOTIFICATION_TYPE;
}
