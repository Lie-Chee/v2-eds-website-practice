let stickyHeaderCount = 0;

function getCellValue(cell) {
  const link = cell.querySelector('a[href^="#"]');
  return (link?.getAttribute('href') || cell.textContent).trim();
}

function getAnchorId(value) {
  const hashIndex = value.indexOf('#');
  if (hashIndex < 0) return '';

  const id = value.slice(hashIndex + 1).trim();
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

function getItems(block) {
  const rows = [...block.children];
  const rowValues = rows.map((row) => [...row.children]
    .map(getCellValue)
    .filter(Boolean));
  const pairedRows = rowValues
    .filter((values) => values.length >= 2)
    .map(([label, anchor]) => ({ label, id: getAnchorId(anchor) }))
    .filter(({ label, id }) => label && id);

  const candidates = pairedRows.length
    ? pairedRows
    : rowValues
      .flat()
      .filter((value) => value.toLowerCase() !== 'anchor id')
      .reduce((items, value, index, values) => {
        if (index % 2 === 0) {
          items.push({ label: value, id: getAnchorId(values[index + 1] || '') });
        }
        return items;
      }, [])
      .filter(({ label, id }) => label && id);

  const ids = new Set();
  return candidates.filter(({ id }) => {
    if (ids.has(id)) return false;
    ids.add(id);
    return true;
  });
}

function getFixedHeaderHeight() {
  const header = document.querySelector('header .nav-wrapper');
  return header && getComputedStyle(header).position === 'fixed'
    ? header.getBoundingClientRect().height
    : 0;
}

function scrollToTarget(event, block, id) {
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  const top = target.getBoundingClientRect().top
    + window.scrollY
    - block.offsetHeight
    - getFixedHeaderHeight();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.history.pushState(null, '', `#${encodeURIComponent(id)}`);
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });

  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
}

function setupScrollState(block, links) {
  const wrapper = block.closest('.sticky-header-wrapper');
  const toggle = block.querySelector('.sticky-header-toggle');
  const sentinel = document.createElement('div');
  sentinel.className = 'sticky-header-sentinel';
  block.before(sentinel);

  const targets = links
    .map((link) => ({
      link,
      progress: link.parentElement.querySelector('.sticky-header-progress'),
      target: document.getElementById(link.dataset.anchorId),
    }))
    .filter(({ target }) => target);
  let activeLink;
  let animationFrame;

  const closeMenu = () => {
    block.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = block.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  links.forEach((link) => link.addEventListener('click', closeMenu));

  const update = () => {
    animationFrame = null;
    const headerHeight = getFixedHeaderHeight();
    const isSticky = sentinel.getBoundingClientRect().top <= headerHeight;
    block.classList.toggle('is-sticky', isSticky);
    wrapper?.classList.toggle('has-sticky-header', isSticky);

    const threshold = headerHeight + block.offsetHeight + 1;
    const scrollPosition = window.scrollY + threshold;
    const activeIndex = targets.reduce((currentIndex, item, index) => (
      item.target.getBoundingClientRect().top + window.scrollY <= scrollPosition
        ? index
        : currentIndex
    ), 0);
    const active = targets[activeIndex];
    const currentTop = active
      ? active.target.getBoundingClientRect().top + window.scrollY
      : scrollPosition;
    const nextTarget = targets[activeIndex + 1]?.target;
    const nextTop = nextTarget
      ? nextTarget.getBoundingClientRect().top + window.scrollY
      : 0;
    const progressEnd = nextTop || document.documentElement.scrollHeight - window.innerHeight;
    const progress = progressEnd > currentTop
      ? Math.min(100, Math.max(
        0,
        ((scrollPosition - currentTop) / (progressEnd - currentTop)) * 100,
      ))
      : 0;

    targets.forEach(({ progress: bar }) => {
      bar.style.width = '0%';
    });
    if (active) active.progress.style.width = `${progress}%`;

    if (active?.link === activeLink) return;
    activeLink?.removeAttribute('aria-current');
    activeLink?.parentElement.classList.remove('is-active');
    activeLink = active?.link;
    activeLink?.setAttribute('aria-current', 'location');
    activeLink?.parentElement.classList.add('is-active');
  };

  const requestUpdate = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
}

/**
 * Decorates the sticky header block.
 * @param {Element} block The sticky header block
 */
export default function decorate(block) {
  const items = getItems(block);
  if (!items.length) {
    block.remove();
    return;
  }

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'On this page');
  const list = document.createElement('ul');
  stickyHeaderCount += 1;
  list.id = `sticky-header-list-${stickyHeaderCount}`;

  const links = items.map(({ label, id }, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const number = document.createElement('span');
    number.className = 'sticky-header-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const text = document.createElement('span');
    text.textContent = label;
    link.href = `#${encodeURIComponent(id)}`;
    link.dataset.anchorId = id;
    link.append(number, text);
    link.addEventListener('click', (event) => scrollToTarget(event, block, id));

    const progress = document.createElement('span');
    progress.className = 'sticky-header-progress';
    item.append(link, progress);
    list.append(item);
    return link;
  });

  const toggle = document.createElement('button');
  toggle.className = 'sticky-header-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Show on-page navigation');
  toggle.setAttribute('aria-controls', list.id);
  toggle.setAttribute('aria-expanded', 'false');
  const toggleIcon = document.createElement('i');
  toggleIcon.className = 'fas fa-chevron-down fa-2x';
  toggleIcon.setAttribute('aria-hidden', 'true');
  toggle.append(toggleIcon);

  nav.append(list, toggle);
  block.replaceChildren(nav);
  setupScrollState(block, links);
}
