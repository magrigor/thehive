import { JSDOM } from 'jsdom';
import createRenderEndorsedArticles from '../../src/editorial-community-page/render-endorsed-articles';
import Doi from '../../src/types/doi';

describe('render-endorsed-articles component', (): void => {
  describe('when there are no endorsed articles', (): void => {
    it('displays a count of zero', async (): Promise<void> => {
      const renderEndorsedArticles = createRenderEndorsedArticles(async () => []);
      const rendered = JSDOM.fragment(await renderEndorsedArticles('any-old-id'));

      expect(rendered.querySelector('h2')?.nodeName).toBe('H2');
      expect(rendered.querySelector('[data-test-id="endorsementsCount"]')?.textContent).toStrictEqual('0');
    });
  });

  describe('when there is an endorsed article', () => {
    it('displays the article count', async () => {
      const renderEndorsedArticles = createRenderEndorsedArticles(async () => [
        {
          doi: new Doi('10.1101/209320'),
          title: 'Some article title',
        },
      ]);
      const rendered = JSDOM.fragment(await renderEndorsedArticles('53ed5364-a016-11ea-bb37-0242ac130002'));

      expect(rendered.querySelector('h2')?.nodeName).toBe('H2');
      expect(rendered.querySelector('[data-test-id="endorsementsCount"]')?.textContent).toStrictEqual('1');
    });
  });
});
