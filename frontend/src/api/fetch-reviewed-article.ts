import { FetchReview } from './fetch-review';
import article3 from '../data/article3';
import article4 from '../data/article4';
import ReviewReferenceRepository from '../types/review-reference-repository';
import { ReviewedArticle } from '../types/reviewed-article';

export type FetchReviewedArticle = (doi: string) => Promise<ReviewedArticle>;

export default (reviewReferenceRepository: ReviewReferenceRepository, fetchReview: FetchReview):
FetchReviewedArticle => (
  async (doi: string): Promise<ReviewedArticle> => {
    const articleReviews = reviewReferenceRepository.findReviewDoisForArticleDoi(doi);

    if (articleReviews.length === 0) {
      throw new Error(`Article DOI ${doi} not found`);
    }

    const allArticles = [
      article3,
      article4,
    ];

    const [matched] = allArticles.filter((reviewedArticle) => reviewedArticle.article.doi === doi);

    return {
      article: matched.article,
      reviews: await Promise.all(articleReviews.map(fetchReview)),
    };
  }
);
