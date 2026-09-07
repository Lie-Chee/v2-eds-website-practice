/**
 * Decorates authored rows as an accessible breadcrumb trail.
 * Each non-empty row represents one breadcrumb item.
 * @param {Element} block The breadcrumbs block
 */
export default function decorate(block) {
  const items = [...block.children].filter((row) => row.textContent.trim());
  if (!items.length) return;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const list = document.createElement('ol');
  const iconPath = `${window.hlx?.codeBasePath || ''}/icons/breadcrumb-chevron-link.svg`;

  items.forEach((row, index) => {
    const item = document.createElement('li');
    const authoredLink = row.querySelector('a[href]');
    const content = authoredLink || document.createElement('span');

    if (!authoredLink) content.textContent = row.textContent.trim();
    if (index === items.length - 1) content.setAttribute('aria-current', 'page');

    const chevron = document.createElement('img');
    chevron.className = 'breadcrumbs-chevron';
    chevron.src = iconPath;
    chevron.alt = '';
    chevron.width = 6;
    chevron.height = 10;

    item.append(content, chevron);
    list.append(item);
  });

  nav.append(list);
  block.replaceChildren(nav);
}
