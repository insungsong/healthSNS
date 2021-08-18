import { CommunityPostEntity } from "../../CommunityPost/entities/CommunityPost.entity";
import { CommunityMemberEntity } from "../entities/CommunityMember.entity";

export const getCommunityMemberEntity = async (communityMemberId: number) => {
  try {
    const communityMemberInfo = await CommunityMemberEntity.createQueryBuilder(
      "communityMember"
    )
      .leftJoinAndSelect("communityMember.user", "user")
      .leftJoinAndSelect("communityMember.community", "community")
      .where("communityMember.id = :id", { id: communityMemberId })
      .getOne();

    console.log("communityMemberInfo: ", communityMemberInfo);

    return communityMemberInfo;
  } catch (e) {
    console.log("getCommunityPost Error: ", e);
    return null;
  }
};

export const getCommunityMemberTopRankerList = async (communityId: number) => {
  const topRankList = await CommunityMemberEntity.createQueryBuilder(
    "communityMember"
  )
    .leftJoinAndSelect("communityMember.community", "community")
    .leftJoinAndSelect("communityMember.user", "user")
    .where("community.id = :id", { id: communityId })
    .andWhere(
      "communityMember.rank = 'master' OR communityMember.rank = 'manager'"
    )
    .getMany();

  console.log("topRankList: ", topRankList);

  return topRankList;
};

export const createCommunityMemberEntity = async (
  mrloginId: number,
  communityId: number
) => {
  return await CommunityMemberEntity.create({
    user: {
      mrloginId,
    },
    community: {
      id: communityId,
    },
  }).save();
};
