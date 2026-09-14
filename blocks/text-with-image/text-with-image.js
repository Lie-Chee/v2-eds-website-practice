/**
 * Text with image block decoration.
 *
 * Displays an eyebrow, heading, body copy, and up to two calls to action
 * beside an image. The default layout places text on the left. Variants can
 * place the image on the left, widen the image, compact the spacing, align
 * content to the top, or apply a dark, light, or white theme.
 *
 * ## Authoring model (Document Authoring / Google Docs table)
 *
 * Default example:
 *
 * | Text With Image |
 * |-----------------|-----------------|
 * | Eyebrow<br>Heading 2<br>Body copy.<br>**Primary** → /one<br>*Secondary* → /two | Image |
 *
 * Image-left example:
 *
 * | Text With Image (Image Left, Dark) |
 * |-----------------|-----------------|
 * | Eyebrow copy<br>Heading 2<br>Body copy<br>**Primary CTA** → /primary | Image |
 *
 * Minimum example:
 *
 * | Text With Image |
 * |-----------------|-----------------|
 * | Heading 2<br>Body copy | Image |
 *
 * ### Rules
 *
 * - Use one row with a text cell and an image cell.
 * - A heading and image are recommended; eyebrow, body, and links are optional.
 * - Put the optional eyebrow paragraph before the heading.
 * - Format the primary CTA as a **bold link**.
 * - Format the secondary CTA as an *italic link*.
 * - Add useful image alternative text in the document editor. Leave it empty
 *   only when the image is decorative.
 * - Supported variant names are `Image Left`, `Wide Image`, `Compact`,
 *   `Align Top`, `Dark`, `Light`, and `White`. Variants can be combined.
 *
 * ### HTML table equivalent
 *
 * ```html
 * <table>
 *   <tr><td>Text With Image (Image Left, Dark)</td></tr>
 *   <tr>
 *     <td>
 *       <p>Eyebrow copy</p>
 *       <h2>Heading</h2>
 *       <p>Body copy.</p>
 *       <p><strong><a href="/primary">Primary CTA</a></strong></p>
 *       <p><em><a href="/secondary">Secondary CTA</a></em></p>
 *     </td>
 *     <td><picture><img src="/image.jpg" alt="Description"></picture></td>
 *   </tr>
 * </table>
 * ```
 */

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
