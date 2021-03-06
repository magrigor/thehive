let googleAnalytics = '';
if (process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
  googleAnalytics = `
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
    script.setAttribute('async', '');
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
  `;
}

export default (page: string): string => `<!doctype html>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    The Hive
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">

  <header class="ui container">

    <nav>

      <ul class="ui large text menu">

        <li class="item">
          <a href="/">Home</a>
        </li>

        <li class="item">
          <a href="/about">About</a>
        </li>

        <li class="right item">
          <a href="https://eepurl.com/g7qqcv" class="ui primary button">Give us feedback</a>
        </li>

      </ul>

    </nav>

  </header>

  <main class="ui container">
    ${page}
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.js"></script>
  <script>
    function onConsent() {
        if (!this.hasConsented()) {
          return;
        }
        ${googleAnalytics}
    }

    window.cookieconsent.initialise({
      content: {
        message: 'This site uses cookies to deliver its services and analyse traffic. By using this site, you agree to its use of cookies.'
      },
      onInitialise: onConsent,
      onStatusChange: onConsent,
      palette: {
        popup: {
          background: 'rgb(0, 0, 0, 0.8)',
        }
      }
    });
  </script>
`;
