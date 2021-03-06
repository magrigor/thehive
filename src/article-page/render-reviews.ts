import { Result } from 'true-myth';
import { RenderReview } from './render-review';
import templateListItems from '../templates/list-items';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

export type RenderReviews = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type GetReviews = (doi: Doi) => Promise<Array<{
  editorialCommunityId: EditorialCommunityId,
  reviewId: ReviewId,
}>>;

export default (
  renderReview: RenderReview,
  reviews: GetReviews,
  id: string,
): RenderReviews => (
  async (doi) => {
    const renderedReviews = await Promise.all((await reviews(doi)).map(async (review, index) => (
      renderReview(review.reviewId, review.editorialCommunityId, `review-${index}`)
    )));
    if (renderedReviews.length === 0) {
      return Result.err('no-content');
    }
    return Result.ok(`
      <section id="${id}">
        <h2 class="ui header">
          Reviews
        </h2>
        <ol class="ui very relaxed divided items ordered list">
          ${templateListItems(renderedReviews)}
        </ol>
      </section>
    `);
  }
);
