function getCell(row) {
  return row.firstElementChild || row;
}

function getTextElement(row, className) {
  if (!row) return null;

  const cell = getCell(row);
  const element = cell.children.length === 1
    && cell.firstElementChild.matches('p, h2, h3, h4, h5, h6')
    ? cell.firstElementChild
    : document.createElement('p');

  if (!element.parentElement) {
    while (cell.firstChild) element.append(cell.firstChild);
  }

  if (!element.textContent.trim() && !element.querySelector('a')) return null;
  element.className = className;
  return element;
}

/**
 * Decorates the full-width banner hero variant.
 * @param {Element} block hero block
 */
export default function decorate(block) {
  if (!block.classList.contains('full-width-banner')) return;

  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const imageRows = rows.filter((row) => row.querySelector('picture'));
  const heading = block.querySelector('h1');
  const headingRow = heading && rows.find((row) => row.contains(heading));
  const ctaRow = rows.find((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    return links.length === 1
      && getCell(row).textContent.trim() === links[0].textContent.trim();
  });
  const textRows = rows.filter((row) => (
    !imageRows.includes(row) && row !== headingRow && row !== ctaRow
  ));
  const headingIndex = headingRow ? rows.indexOf(headingRow) : -1;
  const explicitSubheadingRow = textRows.find((row) => row.querySelector('h2, h3, h4, h5, h6'));
  const subheadingRow = explicitSubheadingRow
    || (headingRow && textRows.find((row) => rows.indexOf(row) < headingIndex))
    || (textRows.length > 1 && textRows[0]);
  const supportingRow = textRows.find((row) => (
    row !== subheadingRow && (headingIndex < 0 || rows.indexOf(row) > headingIndex)
  ));

  const background = imageRow?.querySelector('picture');
  background?.classList.add('hero-banner-background');

  const subheading = getTextElement(subheadingRow, 'hero-banner-subheading');
  const supportingText = getTextElement(supportingRow, 'hero-banner-supporting-text');
  const cta = getTextElement(ctaRow, 'button-wrapper');
  const ctaLink = cta?.querySelector('a[href]');

  if (ctaLink) {
    cta.replaceChildren(ctaLink);
    ctaLink.className = 'button primary';
  }

  const contentElements = [subheading, heading, supportingText, cta].filter(Boolean);
  if (!background && !contentElements.length) {
    block.remove();
    return;
  }

  const content = document.createElement('div');
  content.className = 'hero-banner-content';
  const contentInner = document.createElement('div');
  contentInner.className = 'hero-banner-content-inner';
  contentInner.append(...contentElements);
  content.append(contentInner);

  block.replaceChildren(...[background, content].filter(Boolean));
}
