import { Query, Resolver } from "type-graphql";

@Resolver()
export class InterestResolver {
  @Query(() => Boolean)
  async users() {
    return true;
  }
}
