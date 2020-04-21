import templateArticlePageHeader from '../../src/templates/article-page-header';

describe('article page header template', (): void => {
  const article = {
    title: 'Something interesting',
    category: 'Shoe trees',
    type: 'Thing',
    doi: '1234',
    publicationDate: new Date('2009-11-28'),
    authors: ['Gary', 'Uncle Wiggly'],
  };
  let actual: string;

  beforeEach(() => {
    actual = templateArticlePageHeader(article);
  });

  it('renders inside an header tag', () => {
    expect(actual).toEqual(expect.stringMatching(/^<header>/));
  });

  it('renders the article category', () => {
    expect(actual).toEqual(expect.stringContaining(article.category));
  });

  it('renders the article type', () => {
    expect(actual).toEqual(expect.stringContaining(article.type));
  });

  it('renders the article DOI', () => {
    expect(actual).toEqual(expect.stringContaining(article.doi));
  });

  it('renders the article publication date', () => {
    expect(actual).toEqual(expect.stringContaining('2009-11-28'));
  });

  it('renders the article authors', () => {
    article.authors.forEach((author) => {
      expect(actual).toEqual(expect.stringContaining(author));
    });
  });
});