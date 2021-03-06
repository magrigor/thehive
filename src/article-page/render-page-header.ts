import { Maybe, Result } from 'true-myth';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
import Doi from '../types/doi';

interface ArticleDetails {
  title: string;
  authors: Array<string>;
  publicationDate: Date;
}

export type GetArticleDetails = (doi: Doi) => Promise<Result<ArticleDetails, 'not-found'|'unavailable'>>;

export type GetReviewCount = (doi: Doi) => Promise<number>;

export type GetCommentCount = (doi: Doi) => Promise<Maybe<number>>;
export type GetEndorsingEditorialCommunityNames = (doi: Doi) => Promise<Array<string>>;

export type RenderPageHeader = (doi: Doi) => Promise<Result<string, 'not-found'|'unavailable'>>;

export default (
  getArticleDetails: GetArticleDetails,
  getReviewCount: GetReviewCount,
  getCommentCount: GetCommentCount,
  getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames,
  reviewsLinkTarget: string,
): RenderPageHeader => async (doi) => {
  const articleDetails = await getArticleDetails(doi);

  let reviews = '';
  const reviewCount = await getReviewCount(doi);
  if (reviewCount > 0) {
    reviews = `
      <a href="${reviewsLinkTarget}" data-test-id="reviewsLink">
        <div class="ui label">
          Reviews
          <span class="detail">${reviewCount}</span>
        </div>
      </a>
    `;
  }

  let comments = '';
  const commentCount = (await getCommentCount(doi)).unwrapOr(0);
  if (commentCount > 0) {
    comments = `
      <a href="https://www.biorxiv.org/content/${doi.value}v1" data-test-id="biorxivCommentLink">
        <div class="ui label">
          Comments
          <span class="detail">${commentCount}</span>
        </div>
      </a>
    `;
  }

  let endorsements = '';
  const endorsingEditorialCommunityNames = await getEndorsingEditorialCommunityNames(doi);

  if (endorsingEditorialCommunityNames.length > 0) {
    endorsements = `
        <div class="ui label">
          Endorsed by
          <span class="detail">${endorsingEditorialCommunityNames.join(', ')}</span>
        </div>
      `;
  }

  return articleDetails.map((details) => `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">${details.title}</h1>

        <ol aria-label="Authors of this article" class="ui comma separated horizontal list">
          ${templateListItems(details.authors)}
        </ol>

        <ul aria-label="Publication details" class="ui list">
          <li class="item">
            DOI <a href="https://doi.org/${doi.value}">${doi.value}</a>
          </li>
          <li class="item">
            Posted ${templateDate(details.publicationDate)}
          </li>
        </ul>

        ${reviews}
        ${comments}
        ${endorsements}
      </header>
    `);
};
