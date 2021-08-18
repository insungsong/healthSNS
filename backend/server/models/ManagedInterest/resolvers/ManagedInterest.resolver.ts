import { Query, Resolver } from "type-graphql";

@Resolver()
export class ManagedInterestResolver {
  @Query(() => Boolean)
  async users() {
    return true;
  }
}
