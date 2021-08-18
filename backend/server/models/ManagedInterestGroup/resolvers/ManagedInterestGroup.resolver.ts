import { Query, Resolver } from "type-graphql";
import { ManagedInterestGroupEntity } from "../entities/ManagedInterestGroup.entity";
import { ManagedInterestGroupObject } from "../objects/ManagedInterestGroup.object";

@Resolver()
export class ManagedInterestGroupResolver {
  @Query(() => [ManagedInterestGroupObject])
  //관리자가 지정한 관심분야 카테고리 별 해당하는 그룹과 그 그룹 하위의 관심 분야리스트를 보여주는 query
  async managedInterestGroupList() {
    try {
      const managedInterestGroupList = await ManagedInterestGroupEntity.createQueryBuilder(
        "managedInterestGroup"
      )
        .leftJoinAndSelect(
          "managedInterestGroup.managedInterest",
          "managedInterest"
        )
        .getMany();

      console.log("managedInterestGroupList: ", managedInterestGroupList);

      return managedInterestGroupList;
    } catch (e) {
      console.log("managedInterestGroupList Error: ", e);
      return null;
    }
  }
}
