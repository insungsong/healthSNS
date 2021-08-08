/**
 * User 에 대한 Model 입니다.
 *
 * @author BounceCode, Inc.
 * @packageDocumentation
 * @module server.models.User.resolvers
 * @preferred
 */

import { Resolver, Query, Mutation, Ctx, Arg, Args } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { UserEntity } from "../entities/User.entity";
import { UserObject } from "../objects/User.object";
/**
 * User 와 관련된 요청을 처리합니다.
 *
 * @author BounceCode, Inc.
 */
@Resolver()
export class UserResolver {
  @Query(() => [UserObject])
  async users() {
    try {
      const users = await UserEntity.createQueryBuilder("user").getMany();

      return users;
    } catch (e) {
      console.log("users Error: ", e);
    }
  }
}
