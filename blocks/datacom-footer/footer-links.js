/**
 * Scraped footer links from https://datacom.com/nz/en
 * Source selector: .datacom-fixed-width.footer__ctn
 * Scraped: 2026-09-25
 *
 * Change location was a modal trigger in the source component. It is stored
 * here as a normal link for this implementation.
 */

export const FOOTER_SOURCE = {
  url: 'https://datacom.com/nz/en',
  selector: '.datacom-fixed-width.footer__ctn',
  scrapedAt: '2026-09-25',
};

/**
 * Footer columns and links as authored on the reference page.
 * Relative hrefs are locale-prefixed (/nz/en/...).
 * Social links open in a new tab (target="_blank").
 */
export const FOOTER_COLUMNS = [
  {
    label: 'Explore more of Datacom',
    links: [
      { text: 'Insights', href: '/nz/en/insights' },
      { text: 'Who we are', href: '/nz/en/about-us/who-we-are' },
      { text: 'Our sustainability journey', href: '/nz/en/about-us/sustainability' },
      { text: 'Our locations', href: '/nz/en/about-us/our-locations' },
      { text: 'Year in review', href: '/nz/en/about-us/year-in-review' },
    ],
  },
  {
    label: 'Work with us',
    links: [
      { text: 'Careers at Datacom', href: '/nz/en/careers' },
      { text: 'Partners', href: '/nz/en/about-us/partners' },
      {
        text: 'Rainbow Tick',
        href: '/nz/en/insights/news/datacom-is-rainbow-tick-certified',
        image: {
          src: '/icons/rainbow-tick.svg',
          width: 16,
          height: 14,
        },
      },
    ],
  },
  {
    label: 'Social',
    links: [
      {
        text: 'Facebook',
        href: 'https://www.facebook.com/datacomcommunity',
        target: '_blank',
        external: true,
      },
      {
        text: 'Instagram',
        href: 'https://www.instagram.com/datacomlife/?hl=en',
        target: '_blank',
        external: true,
      },
      {
        text: 'LinkedIn',
        href: 'https://www.linkedin.com/company/datacom/',
        target: '_blank',
        external: true,
      },
      {
        text: 'YouTube',
        href: 'https://www.youtube.com/channel/UCbvrudIoBQ1vx55Ra-ximiw',
        target: '_blank',
        external: true,
      },
    ],
  },
  {
    label: null,
    ariaLabel: 'Legal and location',
    isLastColumn: true,
    links: [
      { text: 'Privacy policy', href: '/nz/en/legal/privacy-policy' },
      { text: 'GDPR', href: '/nz/en/legal/gdpr-statement' },
      { text: 'Terms of use', href: '/nz/en/legal/terms-of-use' },
      { text: 'Legal', href: '/nz/en/legal' },
      {
        text: 'Shielded site',
        href: '/nz/en',
        image: {
          src: '/icons/shielded-site.svg',
          width: 14,
          height: 14,
        },
      },
      { text: 'Change location', href: '/nz/en', iconClass: 'fal fa-globe' },
    ],
    copyright: 'Datacom',
  },
];

/** Flat list of the 17 scraped anchors plus the converted location link. */
export const FOOTER_LINKS = FOOTER_COLUMNS.flatMap((column) => column.links);

export default FOOTER_COLUMNS;
