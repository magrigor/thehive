import { IncomingMessage, ServerResponse } from 'http';
import { Handler, HTTPVersion } from 'find-my-way';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { FetchReviewedArticle } from '../api/fetch-reviewed-article';
import createLogger from '../logger';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';
import { ReviewedArticle } from '../types/reviewed-article';

const log = createLogger('handler:article');

type ArticleParams = {
  [k: string]: string | undefined;
};

export default (fetchReviewedArticle: FetchReviewedArticle): Handler<HTTPVersion.V1> => (
  async (request: IncomingMessage, response: ServerResponse, params: ArticleParams): Promise<void> => {
    if (typeof params.id === 'undefined') {
      log('DOI `id` parameter not present');
      response.writeHead(INTERNAL_SERVER_ERROR);
      response.end('DOI `id` parameter not present');
      return;
    }
    const doi = decodeURIComponent(params.id);
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    let reviewedArticle: ReviewedArticle;
    try {
      reviewedArticle = await fetchReviewedArticle(doi);
    } catch (e) {
      log(`Article ${doi} not found: ${e}`);
      response.writeHead(NOT_FOUND);
      response.end(`${doi} not found`);
      return;
    }

    const page = templatePage(templateArticlePage(reviewedArticle));
    response.writeHead(OK);
    response.end(page);
  }
);
