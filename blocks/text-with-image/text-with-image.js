/**
 * Moves the children of additional text cells into the first text cell.
 * @param {Element} target Cell that receives the content.
 * @param {Element[]} cells Additional authored text cells.
 */
function mergeTextCells(target, cells) {
  cells.forEach((cell) => {
    while (cell.firstChild) target.append(cell.firstChild);
    cell.remove();
  });
}

/**
 * Adds the optional eyebrow class when the first paragraph precedes a heading.
 * @param {Element} content Text content cell.
 */
function decorateEyebrow(content) {
  const first = content.firstElementChild;
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (first?.tagName === 'P' && heading && first !== heading) {
    first.classList.add('text-with-image-eyebrow');
  }
}

/**
 * Reveals the text when the block enters the viewport.
 * @param {Element} block Text with image block.
 */
function observeMotion(block) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    block.classList.add('is-visible');
    return;
  }

  block.classList.add('text-with-image-motion');
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      block.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.25 });
  observer.observe(block);
}

/**
 * Decorates a text with image block.
 * @param {Element} block Text with image block.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cells = rows.flatMap((row) => [...row.children]);
  if (!cells.length) return;

  const media = cells.find((cell) => cell.querySelector('picture, img'));
  const textCells = cells.filter((cell) => cell !== media);
  const content = textCells[0];
  const layout = rows[0];

  if (content) {
    mergeTextCells(content, textCells.slice(1));
    content.classList.add('text-with-image-content');
    decorateEyebrow(content);
  }

  if (media) media.classList.add('text-with-image-media');

  layout.classList.add('text-with-image-layout');
  layout.replaceChildren(...[content, media].filter(Boolean));
  rows.slice(1).forEach((row) => row.remove());
  observeMotion(block);
}
