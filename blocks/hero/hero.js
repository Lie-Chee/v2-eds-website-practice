/**
 * Hero block decoration.
 *
 * Default `hero` variant: CSS-only (background image + heading).
 *
 * `full-width-banner` variant: full-width page title banner with optional
 * product mark, supporting text, CTA, gradient overlay, and slide-up motion.
 *
 * ## Authoring model (Document Authoring / Google Docs table)
 *
 * Block name (header row):
 *
 * | Hero (Full Width Banner) |
 *
 * Full example — one row per content item (delete rows you do not need):
 *
 * | Hero (Full Width Banner) |
 * |--------------------------|
 * | Background image         |
 * | Product mark             |
 * | Secure data centre solutions (Heading 1) |
 * | Supporting paragraph text |
 * | **Request a tour** → https://example.com/request-a-tour |
 *
 * Compact example — all content in one row after the background image:
 *
 * | Hero (Full Width Banner) |
 * |--------------------------|
 * | Background image         |
 * | Product mark, Heading 1, supporting text, and **bold** CTA link |
 *
 * ### Rules
 *
 * - Row 1 must be the background image only.
 * - Use **Heading 1** for the title (do not type `#` in the cell).
 * - Format the CTA as a **bold** link (`**Request a tour**`).
 * - Delete optional rows you are not using; do not leave blank rows.
 * - Multi-line headings: insert a line break inside the Heading 1 cell.
 *
 * ### HTML table equivalent
 *
 * ```html
 * <table>
 *   <tr><td>Hero (Full Width Banner)</td></tr>
 *   <tr><td><p><img src="https://content.da.live/.../hero.jpg" alt="Hero"></p></td></tr>
 *   <tr><td><p><img src="https://content.da.live/.../logo.png" alt="Product mark"></p></td></tr>
 *   <tr><td><h1>Secure data centre solutions</h1></td></tr>
 *   <tr><td><p>Supporting paragraph text.</p></td></tr>
 *   <tr><td><p><strong><a href="https://example.com/tour">Request a tour</a></strong></p></td></tr>
 * </table>
 * ```
 */

/**
 * Returns true when a row contains only a picture (background image row).
 * @param {Element} row Block row element.
 * @returns {boolean}
 */
function isPictureOnlyRow(row) {
  const cell = row.firstElementChild || row;
  if (!cell.querySelector('picture, img')) return false;
  if (cell.querySelector('h1, h2')) return false;

  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((image) => image.remove());
  return clone.textContent.trim() === '';
}

/**
 * Merges all content rows after the background into a single row.
 * @param {Element[]} contentRows Rows that are not the background image row.
 * @returns {Element|null} The merged content row.
 */
function mergeContentRows(contentRows) {
  if (!contentRows.length) return null;
  if (contentRows.length === 1) return contentRows[0];

  const mergedRow = contentRows[0];
  const mergedCell = mergedRow.firstElementChild || mergedRow;

  contentRows.slice(1).forEach((row) => {
    const cell = row.firstElementChild || row;
    while (cell.firstChild) mergedCell.append(cell.firstChild);
    row.remove();
  });

  return mergedRow;
}

/**
 * Wraps element children in an overflow-hidden reveal container for slide-up motion.
 * @param {Element} element Element whose children will be moved into the reveal.
 * @param {string} revealClass Additional reveal class name.
 */
function wrapInReveal(element, revealClass) {
  if (!element || element.querySelector(':scope > .hero-banner-reveal')) return;

  const reveal = document.createElement('div');
  reveal.className = `hero-banner-reveal ${revealClass}`;

  const span = document.createElement('span');
  while (element.firstChild) span.append(element.firstChild);
  reveal.append(span);
  element.append(reveal);
}

/**
 * Splits a heading on line breaks and wraps each line in a reveal container.
 * @param {HTMLHeadingElement} heading Heading element to decorate.
 */
function wrapHeadingReveal(heading) {
  if (!heading || heading.querySelector('.hero-banner-reveal')) return;

  const lines = heading.innerHTML
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    wrapInReveal(heading, 'hero-banner-heading-reveal');
    return;
  }

  heading.replaceChildren(...lines.map((line) => {
    const reveal = document.createElement('div');
    reveal.className = 'hero-banner-reveal hero-banner-heading-reveal';

    const span = document.createElement('span');
    span.innerHTML = line;
    reveal.append(span);
    return reveal;
  }));
}

/**
 * Adds structural classes and entrance animations for the full-width banner variant.
 * The default hero keeps its existing, CSS-only rendering.
 * @param {Element} block The hero block.
 */
export default function decorate(block) {
  if (!block.classList.contains('full-width-banner')) return;

  const rows = [...block.children];
  const backgroundRow = rows.find(isPictureOnlyRow)
    || rows.find((row) => row.querySelector('picture, img'));
  const contentRows = rows.filter((row) => row !== backgroundRow);
  const contentRow = mergeContentRows(contentRows);
  const heading = block.querySelector('h1');
  const pictures = [...block.querySelectorAll('picture')];
  const backgroundPicture = backgroundRow?.querySelector('picture')
    || pictures[0];

  backgroundPicture?.classList.add('hero-banner-background-picture');

  if (!contentRow || !heading) return;

  contentRow.classList.add('hero-banner-content');
  const contentCell = [...contentRow.children]
    .find((cell) => cell.contains(heading)) || contentRow.firstElementChild;
  contentCell?.classList.add('hero-banner-content-inner');

  const logoPicture = pictures.find(
    (picture) => picture !== backgroundPicture && contentRow.contains(picture),
  );
  logoPicture?.classList.add('hero-banner-logo', 'hero-banner-logo-animate');
  if (logoPicture?.parentElement?.tagName === 'P') {
    logoPicture.parentElement.classList.add('hero-banner-logo-container');
  }

  wrapHeadingReveal(heading);

  contentCell?.querySelectorAll('p').forEach((paragraph) => {
    const isLogo = paragraph.classList.contains('hero-banner-logo-container');
    const isCta = paragraph.querySelector('a[href]')
      && (paragraph.querySelector('strong') || paragraph.querySelector('em'));
    if (isLogo || isCta) return;
    wrapInReveal(paragraph, 'hero-banner-subtext-reveal');
  });

  const cta = [...contentCell?.querySelectorAll('p') || []].find((paragraph) => {
    if (paragraph.classList.contains('hero-banner-logo-container')) return false;
    const link = paragraph.querySelector('a[href]');
    return link && (paragraph.querySelector('strong') || paragraph.querySelector('em'));
  });
  cta?.classList.add('hero-banner-cta-reveal');
}
