import addReviewForm from './add-review-form';
import templateArticlePageHeader from './article-page-header';
import templateReviewSummary from './review-summary';
import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import { ArticlePageViewModel } from '../types/article-page-view-model';

interface ArticleHeader {
  title: string;
  authors: Array<string>;
  doi: Doi;
  publicationDate: Date;
}

const createRenderPageHeader = (header: () => ArticleHeader) => (
  (): string => templateArticlePageHeader(header())
);

interface Abstract {
  abstract: string;
}

const createRenderAbstract = (fetchAbstract: (doi: Doi) => Abstract) => (doi: Doi) => {
  const abstract = fetchAbstract(doi);
  return `
    <section role="doc-abstract">
      <h2>
        Abstract
      </h2>
      <div class="abstract">
        ${abstract.abstract}
        <a href="https://doi.org/${doi}" class="abstract__link">
          Read the full article
        </a>
      </div>
    </section>`;
};

export default (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): string => {
  const reviewSummaries = reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
  const articleHeaderAdapter = (): ArticleHeader => article;
  const abstractAdapter = (): Abstract => article;
  const renderPageHeader = createRenderPageHeader(articleHeaderAdapter);
  const renderAbstract = createRenderAbstract(abstractAdapter);
  return `<article>

    ${renderPageHeader()}

    <div class="content">

      ${renderAbstract(article.doi)}

      <section class="review-summary-list">
        <h2>
          Review summaries
        </h2>
        <ol class="review-summary-list__list">
          ${templateListItems(reviewSummaries)}
        </ol>
      </section>

    </div>

    <aside>
      <div class="add-review__form">
        <h2> Add a review<br/>to this article </h2>
        ${addReviewForm(article, editorialCommunities)}
      </div>
    </aside>

  </article>`;
};
