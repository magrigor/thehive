import { createFetchAbstractFromCrossref, MakeHttpRequest } from '../../src/api/fetch-article';
import Doi from '../../src/data/doi';

describe('fetch-abstract-from-crossref', (): void => {
  it('extracts the abstract text from the XML response', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record>
    <crossref>
      <posted_content>
        <abstract>
          Some random nonsense.
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('Some random nonsense.'));
  });

  it('removes the <abstract> element', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record>
    <crossref>
      <posted_content>
        <abstract class="something">
          Some random nonsense.
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.not.stringContaining('<abstract>'));
    expect(abstract).toStrictEqual(expect.not.stringContaining('</abstract>'));
  });

  it('removes the first <title> if present', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record>
    <crossref>
      <posted_content>
        <abstract>
          <title class="something">Abstract</title>
          Some random nonsense.
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.not.stringContaining('Abstract'));
  });

  it('replaces remaining <title>s with HTML <h3>s', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record owner="10.1101" timestamp="2020-06-02 07:46:31">
    <crossref>
      <posted_content type="preprint" language="en" metadata_distribution_opts="any">
      <abstract>
        <title class="something">expected to be removed</title>
        <p>Lorem ipsum</p>
        <title class="something">should be an h3</title>
        <p>Lorem ipsum</p>
        <title class="something">should also be an h3</title>
        </sec>
      </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('<h3>should be an h3</h3>'));
    expect(abstract).toStrictEqual(expect.stringContaining('<h3>should also be an h3</h3>'));
    expect(abstract).toStrictEqual(expect.not.stringContaining('<title>'));
    expect(abstract).toStrictEqual(expect.not.stringContaining('</title>'));
  });

  it('renders italic if present', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record owner="10.1101" timestamp="2020-06-02 07:46:31">
    <crossref>
      <posted_content type="preprint" language="en" metadata_distribution_opts="any">
        <abstract>
          <title>Abstract</title>
          <p>
            The spread of antimicrobial resistance continues to be a priority health concern worldwide, necessitating exploration of alternative therapies.
            <italic class="something">Cannabis sativa</italic>
            has long been known to contain antibacterial cannabinoids, but their potential to address antibiotic resistance has only been superficially investigated. Here, we show that cannabinoids exhibit antibacterial activity against MRSA, inhibit its ability to form biofilms and eradicate pre-formed biofilms and stationary phase cells persistent to antibiotics. We show that the mechanism of action of cannabigerol is through targeting the cytoplasmic membrane of Gram-positive bacteria and demonstrate
            <italic class="something">in vivo</italic>
            efficacy of cannabigerol in a murine systemic infection model caused by MRSA. We also show that cannabinoids are effective against Gram-negative organisms whose outer membrane is permeabilized, where cannabigerol acts on the inner membrane. Finally, we demonstrate that cannabinoids work in combination with polymyxin B against multi-drug resistant Gram-negative pathogens, revealing the broad-spectrum therapeutic potential for cannabinoids.
          </p>
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('<i>Cannabis sativa</i>'));
    expect(abstract).toStrictEqual(expect.stringContaining('<i>in vivo</i>'));
  });

  it('replaces <list> unordered list with HTML <ul>', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record owner="10.1101" timestamp="2020-06-02 07:46:31">
    <crossref>
      <posted_content type="preprint" language="en" metadata_distribution_opts="any">
      <abstract>
        <list class="something" list-type="bullet" id="id-1">
          <list-item class="something">
            <p>Transcriptional regulation of ESRP2.</p>
          </list-item>
          <list-item class="something">
            <p>Both ESRP1 and ESRP2 are highly expressed in prostate cancer tissue.</p>
          </list-item>
        </list>
      </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('<ul>'));
    expect(abstract).toStrictEqual(expect.stringContaining('</ul>'));
    expect(abstract).toStrictEqual(expect.stringContaining('<li>'));
    expect(abstract).toStrictEqual(expect.stringContaining('</li>'));
  });

  it('replaces <sec> with HTML <section>', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record owner="10.1101" timestamp="2020-06-02 07:46:31">
    <crossref>
      <posted_content type="preprint" language="en" metadata_distribution_opts="any">
      <abstract>
        <sec class="something">
          <p>Lorem ipsum</p>
        </sec>
      </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('<section>'));
    expect(abstract).toStrictEqual(expect.stringContaining('</section>'));
    expect(abstract).toStrictEqual(expect.not.stringContaining('<sec>'));
    expect(abstract).toStrictEqual(expect.not.stringContaining('</sec>'));
  });
});