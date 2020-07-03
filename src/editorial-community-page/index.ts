import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createGetReviewedArticlesFromReviewReferences from './get-reviewed-articles-from-review-references';
import createRenderEndorsedArticles, {
  createGetHardCodedEndorsedArticles,
  GetArticleTitle,
  RenderEndorsedArticles,
} from './render-endorsed-articles';
import createRenderPage, { FetchArticle } from './render-page';
import createRenderReviewedArticles, { RenderReviewedArticles } from './render-reviewed-articles';
import { Adapters } from '../types/adapters';
import ReviewReferenceRepository from '../types/review-reference-repository';

const raiseFetchArticleErrors = (fetchArticle: Adapters['fetchArticle']): FetchArticle => (
  async (doi) => {
    const result = await fetchArticle(doi);

    return result.unsafelyUnwrap();
  }
);

const buildRenderEndorsedArticles = (
  fetchArticle: FetchArticle,
): RenderEndorsedArticles => {
  const getArticleTitle: GetArticleTitle = async (articleDoi) => {
    const article = await fetchArticle(articleDoi);
    return article.title;
  };
  const getEndorsedArticles = createGetHardCodedEndorsedArticles(getArticleTitle);
  return createRenderEndorsedArticles(getEndorsedArticles);
};

const buildRenderReviewedArticles = (
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
): RenderReviewedArticles => {
  const getReviewedArticles = createGetReviewedArticlesFromReviewReferences(
    reviewReferenceRepository.findReviewsForEditorialCommunityId,
    fetchArticle,
  );
  return createRenderReviewedArticles(getReviewedArticles);
};

// there should be a clean separation between:
// - knowledge of Koa
// - creation of page and its adapters
export default (adapters: Adapters): Middleware => {
  const fetchArticle = raiseFetchArticleErrors(adapters.fetchArticle);
  const renderEndorsedArticles = buildRenderEndorsedArticles(fetchArticle);
  const renderReviewedArticles = buildRenderReviewedArticles(fetchArticle, adapters.reviewReferenceRepository);

  const renderPage = createRenderPage(
    adapters.editorialCommunities,
    renderEndorsedArticles,
    renderReviewedArticles,
  );

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.params.id);
    await next();
  };
};
