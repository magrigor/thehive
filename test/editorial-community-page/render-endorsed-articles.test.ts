import { JSDOM } from 'jsdom';
import createRenderEndorsedArticles from '../../src/editorial-community-page/render-endorsed-articles';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-endorsed-articles component', (): void => {
  describe('when there are no endorsed articles', (): void => {
    it('displays a count of zero', async (): Promise<void> => {
      const renderEndorsedArticles = createRenderEndorsedArticles(async () => 0);
      const rendered = JSDOM.fragment(await renderEndorsedArticles(new EditorialCommunityId('any-old-id')));

      expect(rendered.querySelector('[data-test-id="endorsementsCount"]')?.textContent).toStrictEqual('0');
    });
  });

  describe('when there is an endorsed article', () => {
    it('displays the article count', async () => {
      const renderEndorsedArticles = createRenderEndorsedArticles(async () => 1);
      const rendered = JSDOM.fragment(await renderEndorsedArticles(new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002')));

      expect(rendered.querySelector('[data-test-id="endorsementsCount"]')?.textContent).toStrictEqual('1');
    });
  });
});
