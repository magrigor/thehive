import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import Doi from '../data/doi';
import { Review } from '../types/review';

export type FetchReview = (doi: Doi) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchReview => (
  async (doi: Doi): Promise<Review> => {
    const reviewIri = namedNode(`https://doi.org/${doi}`);
    const graph = await fetchDataset(reviewIri);

    const author = graph.out(schema.author).out(schema.name).value || 'Unknown author';
    const publicationDate = new Date(graph.out(schema.datePublished).value || 0);
    const summary = graph.out(schema.description).value || 'Unknown summary';

    return {
      author,
      doi,
      publicationDate,
      summary,
    };
  }
);
