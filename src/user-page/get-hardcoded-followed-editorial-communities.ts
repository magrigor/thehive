import { GetFollowedEditorialCommunities } from './render-page';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetFollowedEditorialCommunityIds = (userId: UserId) => Promise<ReadonlyArray<EditorialCommunityId>>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<{
  name: string,
  avatarUrl: string,
}>;

export default (
  getFollowedEditorialCommunityIds: GetFollowedEditorialCommunityIds,
  getEditorialCommunity: GetEditorialCommunity,
): GetFollowedEditorialCommunities => (
  async (userId) => {
    const list = await getFollowedEditorialCommunityIds(userId);
    return Promise.all(list.map(async (editorialCommunityId) => ({
      id: editorialCommunityId,
      ...await getEditorialCommunity(editorialCommunityId),
    })));
  }
);
