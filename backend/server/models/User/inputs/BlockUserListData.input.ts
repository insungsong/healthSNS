import { Field, InputType } from "type-graphql";

@InputType()
export class BlockUserListDataInput {
  @Field((type) => [Number])
  blockUserList?: number[];
}
