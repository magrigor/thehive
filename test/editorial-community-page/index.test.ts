import buildRenderPage from '../../src/editorial-community-page';
import FollowList from '../../src/types/follow-list';
import createServer from '../http/server';

describe('create render page', (): void => {
  describe('when the editorial community exists', (): void => {
    let renderedPage: string;

    beforeEach(async () => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { id: adapters.editorialCommunities.all()[0].id.value, followList: new FollowList([]) };
      renderedPage = (await renderPage(params)).unsafelyUnwrap();
    });

    it('has the editorial community name', async (): Promise<void> => {
      expect(renderedPage).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('has the editorial community description', async (): Promise<void> => {
      expect(renderedPage).toStrictEqual(expect.stringContaining('accelerate'));
    });
  });

  describe('when the editorial community does not exist', (): void => {
    it('throws a NotFound error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { id: 'no-such-community', followList: new FollowList([]) };
      const result = await renderPage(params);

      expect(result.unsafelyUnwrapErr().type).toStrictEqual('not-found');
    });
  });
});
