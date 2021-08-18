import { Field, InputType } from "type-graphql";

@InputType()
export class NotificationWhereInput {
  @Field()
  notificationId: number;
}
