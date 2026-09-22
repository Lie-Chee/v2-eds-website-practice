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

function splitTextLines(element, text) {
  const words = text.split(/\s+/).filter(Boolean);
  const measureWords = words.map((word, index) => {
    const span = document.createElement('span');
    span.className = 'hero-banner-measure-word';
    span.textContent = `${word}${index < words.length - 1 ? ' ' : ''}`;
    return span;
  });

  element.replaceChildren(...measureWords);

  const lines = [];
  measureWords.forEach((word) => {
    const currentLine = lines.at(-1);
    if (!currentLine || currentLine.top !== word.offsetTop) {
      lines.push({ top: word.offsetTop, words: [word.textContent.trim()] });
    } else {
      currentLine.words.push(word.textContent.trim());
    }
  });

  element.replaceChildren(...lines.map((line, index) => {
    const reveal = document.createElement('span');
    reveal.className = 'hero-banner-reveal';

    const content = document.createElement('span');
    content.style.setProperty('--hero-banner-delay', `${(index + 1) * 0.1}s`);
    content.textContent = `${line.words.join(' ')}${index < lines.length - 1 ? ' ' : ''}`;
    reveal.append(content);
    return reveal;
  }));
}

function decorateRevealText(element) {
  if (!element) return;

  const text = element.textContent.trim();
  if (!text) return;

  splitTextLines(element, text);

  if ('ResizeObserver' in window) {
    let { width } = element.getBoundingClientRect();
    const observer = new ResizeObserver(([entry]) => {
      const { width: nextWidth } = entry.contentRect;
      if (Math.abs(nextWidth - width) < 1) return;
      width = nextWidth;
      splitTextLines(element, text);
    });
    observer.observe(element);
  }

  if (document.fonts?.status === 'loading') {
    document.fonts.ready.then(() => splitTextLines(element, text));
  }
}

function setupEntranceAnimation(block) {
  block.classList.add('hero-banner-animation-ready');

  if (!('IntersectionObserver' in window)) {
    block.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    block.classList.add('is-visible');
    observer.disconnect();
  });
  observer.observe(block);
}

/**
 * Decorates the full-width banner hero variant.
 * @param {Element} block hero block
 */
export default function decorate(block) {
  if (!block.classList.contains('full-width-banner')) return;

  const rows = [...block.children];
  const imageRows = rows.filter((row) => row.querySelector('picture'));
  const [backgroundRow, logoRow] = imageRows;
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

  const background = backgroundRow?.querySelector('picture');
  background?.classList.add('hero-banner-background');

  const logo = logoRow?.querySelector('picture');
  let logoContainer = null;
  if (logo) {
    logo.classList.add('hero-banner-logo');
    logoContainer = document.createElement('div');
    logoContainer.className = 'hero-banner-logo-container';
    logoContainer.append(logo);
  }

  const subheading = getTextElement(subheadingRow, 'hero-banner-subheading');
  const supportingText = getTextElement(supportingRow, 'hero-banner-supporting-text');
  const cta = getTextElement(ctaRow, 'button-wrapper');
  const ctaLink = cta?.querySelector('a[href]');

  if (ctaLink) {
    cta.replaceChildren(ctaLink);
    ctaLink.className = 'button primary';
  }

  const copyElements = [subheading, heading, supportingText, cta].filter(Boolean);
  if (!background && !copyElements.length) {
    block.remove();
    return;
  }
  const contentElements = [logoContainer, ...copyElements].filter(Boolean);

  const content = document.createElement('div');
  content.className = 'hero-banner-content';
  const contentInner = document.createElement('div');
  contentInner.className = 'hero-banner-content-inner';
  contentInner.append(...contentElements);
  content.append(contentInner);

  block.replaceChildren(...[background, content].filter(Boolean));
  [subheading, heading, supportingText].forEach(decorateRevealText);
  setupEntranceAnimation(block);
}
