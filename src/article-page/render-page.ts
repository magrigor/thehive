import createRenderAddReviewForm, { GetAllEditorialCommunities } from './render-add-review-form';
import createRenderArticleAbstract, { GetArticleAbstract } from './render-article-abstract';
import createRenderPageHeader, { GetArticleDetails } from './render-page-header';
import createRenderReviewSummaries, { GetArticleReviewSummaries } from './render-review-summaries';
import { ArticlePageViewModel } from './types/article-page-view-model';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default async (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): Promise<string> => {
  const getArticleDetailsAdapter: GetArticleDetails = async () => article;
  const abstractAdapter: GetArticleAbstract = async () => ({ content: article.abstract });
  const reviewsAdapter: GetArticleReviewSummaries = async () => reviews;
  const editorialCommunitiesAdapter: GetAllEditorialCommunities = async () => editorialCommunities.all();
  const renderPageHeader = createRenderPageHeader(getArticleDetailsAdapter);
  const renderArticleAbstract = createRenderArticleAbstract(abstractAdapter);
  const renderReviewSummaries = createRenderReviewSummaries(reviewsAdapter);
  const renderAddReviewForm = createRenderAddReviewForm(editorialCommunitiesAdapter);
  return `<article class="ui aligned stackable grid">
    <div class="row">
      <div class="column">
        ${await renderPageHeader(article.doi)}
      </div>
    </div>

    <div class="row">
      <section class="twelve wide column">
        ${await renderArticleAbstract(article.doi)}
        <section class="review-summary-list">
          ${await renderReviewSummaries()}
        </section>
      </section>
      <aside class="four wide right floated column">
        ${await renderAddReviewForm(article.doi)}
      </aside>
    </div>
  </article>`;
};