import { Context, Middleware, Next } from 'koa';
import { FetchedArticle } from '../../types/fetched-article';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { editorialCommunity, fetchedArticles } = ctx.state;
    const articles: Array<FetchedArticle> = await fetchedArticles;
    const reviewedArticles = articles.map((article) => ({
      doi: article.doi,
      title: article.title,
    }));

    ctx.state.viewModel = {
      name: editorialCommunity.name,
      description: editorialCommunity.description,
      reviewedArticles,
    };

    await next();
  }
);