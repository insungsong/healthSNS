/**
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.objects
 */

import { ObjectType, Field, ID } from "type-graphql";
import GraphQLJSON from "graphql-type-json";

/**
 * {@link UserResolver} 에서 반환되는 데이터를 확인하기위한 ObjectType 입니다.
 *
 * @author BounceCode, Inc.
 */

@ObjectType()
export class InviteUserObject {
  @Field()
  mrloginId: number;

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  name: string;

  @Field()
  inviteDate: string;
}

@ObjectType()
export class HelpYouObject {
  @Field()
  mrloginId: number;

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field()
  pointScore: number;

  @Field()
  creditScore: number;

  @Field()
  birthYear: string;

  @Field()
  gender: string;
}

@ObjectType()
export class UserObject {
  @Field()
  mrloginId: number;

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field()
  pointScore: number;

  @Field()
  creditScore: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  birthYear: string;

  @Field({ nullable: true })
  gender: string;

  @Field()
  isInvite: boolean;

  @Field((type) => [HelpYouObject], { nullable: true })
  helpYou: HelpYouObject[];

  @Field((type) => [HelpYouObject], { nullable: true })
  behelpedYou: HelpYouObject[];

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;

  @Field({ nullable: true })
  deletedDate: Date;
}

@ObjectType()
export class UserMergeObject {
  @Field()
  user: UserObject;

  @Field({ nullable: true })
  invitedUser: InviteUserObject;

  @Field({ nullable: true })
  inviteDate: Date;
}
