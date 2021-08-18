import { Field, InputType } from "type-graphql";

@InputType()
export class NotificationCreateInput {
  @Field({ nullable: true })
  community: number;

  @Field({ nullable: true })
  communityPost: number;

  @Field({ nullable: true })
  communityPostComment: number;
}
