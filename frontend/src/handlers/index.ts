import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
import article2 from '../data/article2';
import templateArticleTeaser from '../templates/article-teaser';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(`<main>

  <header class="content-header">

    <h1>
      PRC
    </h1>

  </header>

  <section>

    <h2>
      Recently reviewed articles
    </h2>

    <ol>

      <li>
        ${templateArticleTeaser(article1, 'article1')}
      </li>

      <li>

        <article>

          <ol aria-label="Article categories">
            <li>
              ${article2.category}
            </li>
          </ol>

          <h3>
            <a href="article2">
              ${article2.title}
            </a>
          </h3>

          <ol aria-label="Authors of this article" class="author-list">
            ${templateListItems(article2.authors)}
          </ol>

          <ul aria-label="Review details">
            <li>
              ${article2.reviews.length} reviews
            </li>
            <li>
              Reviewed ${templateDate(article2.reviews[3].publicationDate)} by ${article2.reviews[3].author}
            </li>
          </ul>

        </article>

      </li>

    </ol>

  </section>

</main>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
