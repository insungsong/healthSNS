import { Field, InputType } from "type-graphql";

@InputType()
export class ReportUpdateDataInput {
  @Field()
  blockingStatus: boolean;
}
