import { Field, InputType } from "type-graphql";

// enum Type {
//   POST = "post",
//   COMMENT = "comment",
// }

enum ReportConfirmType {
  CONFIRM = "confirm",
  CANCEL = "cancel",
}

@InputType()
export class ReportUpdateWhereInput {
  @Field()
  reportId: number;

  @Field()
  reportConfirmType: ReportConfirmType;

  // @Field()
  // type: Type;
}
