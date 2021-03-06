import { FetchDataciteReview } from './fetch-datacite-review';
import { FetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { Review } from './review';
import Doi from '../types/doi';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => Promise<Review>;

export default (
  fetchDataciteReview: FetchDataciteReview,
  fetchHypothesisAnnotation: FetchHypothesisAnnotation,
): FetchReview => (
  async (id) => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id);
    }

    return fetchHypothesisAnnotation(id);
  }
);
