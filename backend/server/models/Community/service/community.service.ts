import { CommunityEntity } from "../../Community/entities/Community.entity";

export const getCommunityEntity = async (communityId: number) => {
  return CommunityEntity.findOne({ id: communityId });
};
