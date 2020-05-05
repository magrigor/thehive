import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import templatePage from '../templates/page';

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.type = 'html';
    response.body = templatePage(`

  <header class="content-header">

    <h1>
      eLife
    </h1>

  </header>

  <section>

    <p>
      eLife is a non-profit organisation created by funders and led by researchers. Our mission is to accelerate
      discovery by operating a platform for research communication that encourages and recognises the most responsible
      behaviours in science.
    </p>

  </section>

  <section>

    <h2>
      Recently reviewed articles
    </h2>

    <ol>
      <li>
        <a href="/articles/10.1101/833392">
          Uncovering the hidden antibiotic potential of Cannabis
        </a>
      </li>
      <li>
        <a href="/articles/10.1101/2020.03.22.002386">
          A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing
        </a>
      </li>
    </ol>

  </section>

`);

    await next();
  }
);
