import { SEE_OTHER } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

const zenodoPrefix = '10.5281';

const validateDoi = (input: string): Doi => {
  try {
    return new Doi(input);
  } catch (err) {
    throw new BadRequest(err.toString());
  }
};

export default (reviewReferenceRepository: ReviewReferenceRepository): Middleware => (
  async ({ request, response }: RouterContext, next: Next): Promise<void> => {
    const { articledoi, reviewdoi } = request.body;

    const reviewDoi = validateDoi(reviewdoi);

    if (!(reviewDoi.hasPrefix(zenodoPrefix))) {
      throw new BadRequest('Not a Zenodo DOI.');
    }

    reviewReferenceRepository.add(new Doi(articledoi), reviewDoi);

    response.redirect(`/articles/${articledoi}`);
    response.status = SEE_OTHER;

    await next();
  }
);