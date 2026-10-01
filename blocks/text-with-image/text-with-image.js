const HARD_CLASSES = ['masterbrand-dark', 'wide-image', 'image-left', 'show-cta'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Returns the value cell from a labelled two-column field row.
 * Falls back to the sole cell for existing one-column content.
 * @param {Element} row Block row.
 * @returns {Element | null}
 */
function getFieldCell(row) {
  return row?.children[1] || row?.firstElementChild || null;
}

/**
 * Parses a YouTube or Vimeo URL into provider + id.
 * @param {string} href Authored media URL.
 * @returns {{ provider: 'youtube' | 'vimeo', id: string } | null}
 */
function parseVideoUrl(href) {
  if (!href) return null;
  let url;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return id ? { provider: 'youtube', id } : null;
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const id = url.searchParams.get('v')
      || url.pathname.match(/\/(?:embed|shorts)\/([^/?#]+)/)?.[1];
    return id ? { provider: 'youtube', id } : null;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
    return id ? { provider: 'vimeo', id } : null;
  }
  return null;
}

/**
 * Finds an authored video link in a cell.
 * @param {Element} cell Field cell.
 * @returns {{ anchor: HTMLAnchorElement, video: { provider: string, id: string } } | null}
 */
function findVideoLink(cell) {
  let anchors = [...cell.querySelectorAll('a[href]')];
  if (!anchors.length) {
    const href = cell.textContent.trim();
    if (parseVideoUrl(href)) {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.textContent = href;
      cell.replaceChildren(anchor);
      anchors = [anchor];
    }
  }

  return anchors
    .map((anchor) => ({ anchor, video: parseVideoUrl(anchor.href) }))
    .find((entry) => entry.video) || null;
}

/**
 * Whether a cell is the optional primary CTA.
 * @param {Element} cell Field cell.
 * @returns {boolean}
 */
function isCtaCell(cell) {
  const anchor = cell.querySelector('a.button, strong a[href], em a[href]');
  return Boolean(anchor && !parseVideoUrl(anchor.href));
}

/**
 * Forces the optional CTA into the hard-set primary button treatment.
 * @param {Element} cell CTA field cell.
 */
function decoratePrimaryCta(cell) {
  const link = cell.querySelector('a[href]');
  if (!link) return;

  link.classList.add('button', 'primary');
  const paragraph = link.closest('p');
  if (paragraph) {
    paragraph.classList.add('button-wrapper');
    return;
  }

  const wrapper = document.createElement('p');
  wrapper.className = 'button-wrapper';
  wrapper.append(link);
  cell.replaceChildren(wrapper);
}

/**
 * Builds an accessible inline iframe for YouTube / Vimeo.
 * @param {{ provider: string, id: string }} video Parsed video.
 * @param {string} title Accessible title.
 * @returns {HTMLIFrameElement}
 */
function createVideoIframe(video, title) {
  const iframe = document.createElement('iframe');
  iframe.className = 'text-with-image-video';
  iframe.title = title || (video.provider === 'youtube' ? 'YouTube video' : 'Vimeo video');
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  );
  iframe.src = video.provider === 'youtube'
    ? `https://www.youtube.com/embed/${video.id}?rel=0`
    : `https://player.vimeo.com/video/${video.id}`;
  return iframe;
}

/**
 * Replaces an authored video link with an inline embed.
 * @param {Element} media Media cell.
 * @param {{ provider: string, id: string }} video Parsed video.
 * @param {HTMLAnchorElement} anchor Authored link.
 * @param {string} title Accessible / schema title.
 */
function decorateVideo(media, video, anchor, title) {
  const wrapper = document.createElement('div');
  wrapper.className = 'text-with-image-video-wrapper';
  wrapper.append(createVideoIframe(video, title));
  const host = anchor.closest('p') || anchor;
  host.replaceWith(wrapper);
  media.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.children.length) p.remove();
  });
}

/**
 * Reads optional VideoObject schema values from cells after the video row.
 * Upload date is detected by YYYY-MM-DD; remaining cells map to title then description.
 * @param {Element[]} cells Cells between video and CTA.
 * @returns {{ uploadDate?: string, title?: string, description?: string }}
 */
function readSchemaFields(cells) {
  const schema = {};
  const remaining = [...cells];
  const dateIndex = remaining.findIndex((cell) => DATE_PATTERN.test(cell.textContent.trim()));
  if (dateIndex >= 0) {
    schema.uploadDate = remaining[dateIndex].textContent.trim();
    remaining.splice(dateIndex, 1);
  }
  if (remaining[0]) schema.title = remaining[0].textContent.trim();
  if (remaining[1]) schema.description = remaining[1].textContent.trim();
  return schema;
}

/**
 * Injects VideoObject JSON-LD when optional video is authored.
 * @param {Element} block Block root.
 * @param {{ provider: string, id: string }} video Parsed video.
 * @param {object} schema Schema field values.
 * @param {Element} [content] Text content for fallbacks.
 */
function decorateVideoSchema(block, video, schema, content) {
  const heading = content?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';
  const body = [...(content?.querySelectorAll(
    'p:not(.text-with-image-sub-heading):not(.button-wrapper)',
  ) || [])]
    .map((p) => p.textContent.trim())
    .filter(Boolean)
    .join(' ');

  const name = schema.title || heading;
  if (!name) return;

  const isYouTube = video.provider === 'youtube';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description: schema.description || body || name,
    thumbnailUrl: schema.thumbnailUrl || undefined,
    uploadDate: schema.uploadDate || undefined,
    embedUrl: isYouTube
      ? `https://www.youtube.com/embed/${video.id}`
      : `https://player.vimeo.com/video/${video.id}`,
    url: isYouTube
      ? `https://www.youtube.com/watch?v=${video.id}`
      : `https://vimeo.com/${video.id}`,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  block.append(script);
}

/**
 * Marks the default sub heading when a paragraph precedes the heading.
 * @param {Element} content Merged text content cell.
 */
function decorateSubHeading(content) {
  const first = content.firstElementChild;
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (first?.tagName === 'P' && heading && first !== heading) {
    first.classList.add('text-with-image-sub-heading');
  }
}

/**
 * Moves field cell children into the shared content cell.
 * @param {Element} target Content cell.
 * @param {Element[]} cells Field cells to merge in order.
 */
function mergeFieldCells(target, cells) {
  cells.forEach((cell) => {
    while (cell.firstChild) target.append(cell.firstChild);
  });
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
 * Applies hard-set layout/theme options from the AEM component baseline.
 * @param {Element} block Text with image block.
 */
function applyHardOptions(block) {
  block.classList.add(...HARD_CLASSES);
}

/**
 * Decorates a text with image block.
 *
 * Default labelled fields: sub heading, heading, body text, main image (+ alt on image).
 * Optional fields: YouTube/Vimeo video, schema (upload date, title, description), CTA.
 *
 * @param {Element} block Text with image block.
 */
export default function decorate(block) {
  applyHardOptions(block);

  const entries = [...block.children]
    .map((row, index) => ({ index, cell: getFieldCell(row) }))
    .filter(({ cell }) => cell);
  if (!entries.length) return;

  const imageEntry = entries.find(({ cell }) => cell.querySelector('picture, img'));
  const videoEntry = entries
    .map((entry) => ({ ...entry, match: findVideoLink(entry.cell) }))
    .find(({ match }) => match);
  const ctaEntry = [...entries].reverse().find(({ cell }) => isCtaCell(cell));
  if (ctaEntry) decoratePrimaryCta(ctaEntry.cell);

  // Default media is the main image. Optional video replaces the displayed media.
  const mediaEntry = videoEntry || imageEntry;
  const reservedIndexes = new Set(
    [imageEntry?.index, videoEntry?.index, ctaEntry?.index].filter(Number.isInteger),
  );

  const contentEnd = Math.min(
    ...[imageEntry?.index, videoEntry?.index, ctaEntry?.index, entries.length]
      .filter(Number.isInteger),
  );
  const textEntries = entries
    .filter(({ index }) => index < contentEnd && !reservedIndexes.has(index))
    .map(({ cell }) => cell);
  if (ctaEntry) textEntries.push(ctaEntry.cell);

  const schemaCells = videoEntry
    ? entries
      .filter(({ index }) => (
        index > videoEntry.index
        && index !== imageEntry?.index
        && index < (ctaEntry?.index ?? entries.length)
      ))
      .map(({ cell }) => cell)
    : [];
  const schema = {
    ...readSchemaFields(schemaCells),
    thumbnailUrl: imageEntry?.cell.querySelector('img')?.src,
  };

  const layout = document.createElement('div');
  layout.classList.add('text-with-image-layout');

  let content;
  if (textEntries.length) {
    [content] = textEntries;
    mergeFieldCells(content, textEntries.slice(1));
    content.classList.add('text-with-image-content');
    decorateSubHeading(content);
  }

  const media = mediaEntry?.cell;
  if (media) {
    media.classList.add('text-with-image-media');
    if (videoEntry) {
      const title = schema.title
        || content?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim()
        || '';
      decorateVideo(media, videoEntry.match.video, videoEntry.match.anchor, title);
    }
  }

  layout.replaceChildren(...[content, media].filter(Boolean));
  block.replaceChildren(layout);
  if (videoEntry) decorateVideoSchema(block, videoEntry.match.video, schema, content);
  observeMotion(block);
}
