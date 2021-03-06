import createGetHardcodedFollowedEditorialCommunities, { GetEditorialCommunity, GetFollowedEditorialCommunityIds } from './get-hardcoded-followed-editorial-communities';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderPage from './render-page';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import FollowList from '../types/follow-list';
import userId from '../types/user-id';

type Ports = {
  editorialCommunities: EditorialCommunityRepository,
};

interface Params {
  userId?: string;
  followList: FollowList;
}

type RenderPage = (params: Params) => Promise<string>;

export default (ports: Ports): RenderPage => {
  const getFollowedEditorialCommunityIds: GetFollowedEditorialCommunityIds = async () => [
    new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  ];

  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle();
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getHardcodedFollowedEditorialCommunities = createGetHardcodedFollowedEditorialCommunities(
    getFollowedEditorialCommunityIds,
    getEditorialCommunity,
  );
  const renderPage = createRenderPage(getHardcodedFollowedEditorialCommunities, renderFollowedEditorialCommunity);
  return async (params) => renderPage(userId(params.userId ?? ''), params.followList);
};
