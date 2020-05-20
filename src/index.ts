import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createFetchArticle from './api/fetch-article';
import createFetchDataset from './api/fetch-dataset';
import createFetchReview from './api/fetch-review';
import fetchStaticFile from './api/fetch-static-file';
import bootstrapReviews from './bootstrap-reviews';
import Doi from './data/doi';
import createEditorialCommunityRepository from './data/in-memory-editorial-communities';
import createReviewReferenceRepository from './data/in-memory-review-references';
import createLogger from './logger';
import createRouter from './router';
import createServer from './server';
import { Adapters } from './types/adapters';

const log = createLogger();

log('Starting server');

const editorialCommunities = createEditorialCommunityRepository();

const reviewReferenceRepository = createReviewReferenceRepository();
for (const [article, {review, editorialCommunityIndex}] of Object.entries(bootstrapReviews)) {
  reviewReferenceRepository.add(
    new Doi(article),
    new Doi(review),
    editorialCommunities.all()[editorialCommunityIndex].id,
    new Date('2020-05-19T14:00:00Z'),
  );
}
reviewReferenceRepository.add(
  new Doi('10.1101/2020.03.22.002386'),
  new Doi('10.5281/zenodo.3756961'),
  editorialCommunities.all()[1].id,
  new Date('2020-05-19T14:00:00Z'),
);

const fetchDataset = createFetchDataset();
const adapters: Adapters = {
  fetchArticle: createFetchArticle(fetchDataset),
  fetchReview: createFetchReview(fetchDataset),
  fetchStaticFile,
  editorialCommunities,
  reviewReferenceRepository,
};

const router = createRouter(adapters);

const server = createServer(router);

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    log('Shutting server down');
  },
  onSignal: async (): Promise<void> => {
    log('Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80);
