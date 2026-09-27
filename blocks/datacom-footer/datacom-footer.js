import { FOOTER_COLUMNS } from './footer-links.js';

function createIcon(className, customClass) {
  const icon = document.createElement('i');
  icon.classList.add(...className.split(' '), customClass);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function createImage(image) {
  const img = document.createElement('img');
  img.className = 'datacom-footer-link-image';
  img.src = `${window.hlx.codeBasePath}${image.src}`;
  img.alt = '';
  img.width = image.width;
  img.height = image.height;
  img.loading = 'lazy';
  return img;
}

function createLink(link) {
  const anchor = document.createElement('a');
  anchor.className = 'datacom-footer-link';
  anchor.href = link.href;
  anchor.textContent = link.text;

  if (link.target) anchor.target = link.target;
  if (link.target === '_blank') anchor.rel = 'noopener noreferrer';

  if (link.external) {
    anchor.append(createIcon('far fa-long-arrow-up', 'datacom-footer-link-icon'));
  } else if (link.image) {
    anchor.append(createImage(link.image));
  } else if (link.iconClass) {
    anchor.append(createIcon(link.iconClass, 'datacom-footer-link-icon'));
  }

  return anchor;
}

function createColumn(column, index) {
  const section = document.createElement('section');
  section.className = 'datacom-footer-column';

  if (column.isLastColumn) {
    section.classList.add('datacom-footer-column-last');
  }

  const header = document.createElement('div');
  header.className = 'datacom-footer-group-header';

  const heading = document.createElement('h2');
  heading.className = 'datacom-footer-heading';
  heading.id = `datacom-footer-heading-${index}`;
  heading.textContent = column.label || column.ariaLabel;
  if (!column.label) heading.classList.add('datacom-footer-visually-hidden');
  section.setAttribute('aria-labelledby', heading.id);
  header.append(heading);

  const list = document.createElement('ul');
  list.className = 'datacom-footer-links';
  list.id = `datacom-footer-links-${index}`;

  if (column.label) {
    const toggle = document.createElement('button');
    toggle.className = 'datacom-footer-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', list.id);
    toggle.setAttribute('aria-label', `Expand ${column.label} footer links`);

    toggle.append(createIcon('far fa-chevron-down', 'datacom-footer-toggle-icon'));

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute(
        'aria-label',
        `${expanded ? 'Expand' : 'Collapse'} ${column.label} footer links`,
      );
    });

    header.append(toggle);
  }

  section.append(header);

  column.links.forEach((link) => {
    const item = document.createElement('li');
    item.append(createLink(link));
    list.append(item);
  });

  section.append(list);

  if (column.copyright) {
    const copyright = document.createElement('p');
    copyright.className = 'datacom-footer-copyright';
    copyright.textContent = `Copyright © ${new Date().getFullYear()} ${column.copyright}`;
    section.append(copyright);
  }

  return section;
}

/**
 * Builds the global Datacom footer from the captured navigation data.
 * @param {Element} block The footer block element.
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'datacom-footer-container';

  FOOTER_COLUMNS.forEach((column, index) => {
    container.append(createColumn(column, index));
  });

  block.replaceChildren(container);
}
