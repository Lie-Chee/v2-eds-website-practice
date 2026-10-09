import { moveInstrumentation } from '../../scripts/scripts.js';

function normalizeFieldName(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getFieldCell(block, fieldName) {
  const normalizedName = normalizeFieldName(fieldName);
  const row = [...block.children].find((candidate) => {
    const [label] = candidate.children;
    return label && normalizeFieldName(label.textContent) === normalizedName;
  });
  return row?.children[1] || null;
}

function createFallback(block, text) {
  const fallback = document.createElement('span');
  fallback.className = 'cta-button-link cta-button-text';
  fallback.setAttribute('aria-disabled', 'true');
  fallback.textContent = text || 'CTA unavailable';
  block.replaceChildren(fallback);
}

/**
 * Decorates a CTA button block.
 * @param {Element} block The CTA button block.
 */
export default function decorate(block) {
  const textCell = getFieldCell(block, 'Button text');
  const linkCell = getFieldCell(block, 'Link');
  const authoredLink = linkCell?.querySelector('a[href]');
  const href = authoredLink?.getAttribute('href') || linkCell?.textContent.trim();
  const buttonText = textCell?.textContent.trim() || authoredLink?.textContent.trim();

  if (!href) {
    createFallback(block, buttonText);
    return;
  }

  const link = authoredLink || document.createElement('a');
  link.className = 'cta-button-link';
  link.setAttribute('href', href);
  if (link.target === '_blank') link.setAttribute('rel', 'noopener noreferrer');

  const text = document.createElement('span');
  text.className = 'cta-button-text';
  text.textContent = buttonText || 'Continue';
  if (textCell) moveInstrumentation(textCell, text);
  link.replaceChildren(text);
  block.replaceChildren(link);
}
