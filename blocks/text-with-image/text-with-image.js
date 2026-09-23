const HARD_CLASSES = ['masterbrand-dark', 'wide-image', 'image-left', 'show-cta'];

/**
 * Returns the sole cell for a one-column field row.
 * @param {Element} row Block row.
 * @returns {Element | null}
 */
function getFieldCell(row) {
  return row?.firstElementChild;
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
 * Finds an authored video link in a media cell.
 * @param {Element} media Media cell.
 * @returns {{ anchor: HTMLAnchorElement, video: { provider: string, id: string } } | null}
 */
function findVideoLink(media) {
  let anchors = [...media.querySelectorAll('a[href]')];
  if (!anchors.length) {
    const href = media.textContent.trim();
    if (parseVideoUrl(href)) {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.textContent = href;
      media.replaceChildren(anchor);
      anchors = [anchor];
    }
  }
  const match = anchors
    .map((anchor) => ({ anchor, video: parseVideoUrl(anchor.href) }))
    .find((entry) => entry.video);
  return match || null;
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
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
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
 * Injects VideoObject JSON-LD for SEO when video media is present.
 * @param {Element} block Block root.
 * @param {{ provider: string, id: string }} video Parsed video.
 * @param {object} schema Schema field values.
 * @param {Element} [content] Text content cell for fallbacks.
 */
function decorateVideoSchema(block, video, schema, content) {
  const heading = content?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';
  const body = [...(content?.querySelectorAll('p:not(.text-with-image-eyebrow):not(.button-wrapper)') || [])]
    .map((p) => p.textContent.trim())
    .filter(Boolean)
    .join(' ');

  const name = schema['video-title'] || heading;
  const description = schema['video-description'] || body;
  const uploadDate = schema['upload-date'];
  if (!name) return;

  const isYouTube = video.provider === 'youtube';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description: description || name,
    thumbnailUrl: schema.thumbnailUrl || (isYouTube
      ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
      : undefined),
    uploadDate: uploadDate || undefined,
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
 * Marks the sub heading when the first content child is a paragraph before a heading.
 * @param {Element} content Merged text content cell.
 */
function decorateSubHeading(content) {
  const first = content.firstElementChild;
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (first?.tagName === 'P' && heading && first !== heading) {
    first.classList.add('text-with-image-eyebrow');
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
 * Switch image/text, show CTA, widen image, and Masterbrand Dark are always on.
 * @param {Element} block Text with image block.
 */
function applyHardOptions(block) {
  block.classList.add(...HARD_CLASSES);
}

/**
 * Decorates a text with image block.
 * Uses semantic one-column rows so optional text fields do not shift the model.
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
  const ctaEntry = [...entries].reverse().find(({ cell }) => {
    const anchor = cell.querySelector('a.button, strong a[href]');
    return anchor && !parseVideoUrl(anchor.href);
  });
  if (ctaEntry) {
    const link = ctaEntry.cell.querySelector('a[href]');
    link.classList.add('button', 'primary');
    const paragraph = link.closest('p');
    if (paragraph) {
      paragraph.classList.add('button-wrapper');
    } else {
      const wrapper = document.createElement('p');
      wrapper.className = 'button-wrapper';
      wrapper.append(link);
      ctaEntry.cell.replaceChildren(wrapper);
    }
  }

  const mediaEntry = videoEntry || imageEntry;
  const mediaIndexes = [imageEntry?.index, videoEntry?.index].filter(Number.isInteger);
  const contentEnd = Math.min(
    ...mediaIndexes,
    ...(ctaEntry ? [ctaEntry.index] : []),
    entries.length,
  );
  const textEntries = entries
    .filter(({ index }) => index < contentEnd)
    .map(({ cell }) => cell);
  if (ctaEntry) textEntries.push(ctaEntry.cell);

  const schemaCells = videoEntry
    ? entries
      .filter(({ index }) => (
        index > videoEntry.index && index < (ctaEntry?.index ?? entries.length)
      ))
      .map(({ cell }) => cell)
    : [];
  const schema = {
    'upload-date': schemaCells[0]?.textContent.trim(),
    'video-title': schemaCells[1]?.textContent.trim(),
    'video-description': schemaCells[2]?.textContent.trim(),
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
      const title = schema['video-title']
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
