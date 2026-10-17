// Meridiana — site of github.com/moobitech/meridiana-docs, published on GitHub Pages at
// https://meridiana.moobitech.it. tools/export-docs.mjs copies site/ to the root of the docs
// repository, next to the docs: the pages are those Markdown files, at their own paths (/docs/…), so
// their relative links work on GitHub and here alike.
import { defineConfig } from 'vitepress';

const guide = [
  ['Getting started', '/docs/getting-started'],
  ['Angular', '/docs/angular'],
  ['React', '/docs/react'],
  ['React Native', '/docs/react-native'],
  ['Theming', '/docs/theming'],
  ['Events and interactions', '/docs/events-and-interactions'],
  ['Core engine', '/docs/core'],
];

export default defineConfig({
  title: 'Meridiana',
  description:
    'Calendar and scheduler components for Angular, React and React Native, styled with Tailwind CSS.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: false,
  // The README is the landing page on GitHub; here the home page (index.md) takes its place
  srcExclude: ['README.md', 'node_modules/**'],
  head: [['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]],
  // The plans of the pricing page are cards here (PlanCards); its Markdown table is for GitHub
  transformPageData(pageData) {
    if (pageData.relativePath === 'docs/pricing.md') {
      pageData.frontmatter.pageClass = 'pricing-page';
      pageData.frontmatter.aside = false;
    }
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      {
        text: 'Docs',
        link: '/docs/getting-started',
        activeMatch: '^/(docs|core|angular|react|native|meridiana)/(?!pricing|roadmap)',
      },
      { text: 'Pricing', link: '/docs/pricing' },
      { text: 'Roadmap', link: '/docs/roadmap' },
    ],
    sidebar: [
      { text: 'Guide', items: guide.map(([text, link]) => ({ text, link })) },
      {
        text: 'Packages',
        items: ['meridiana', 'core', 'angular', 'react', 'native'].map((name) => ({
          text: name === 'meridiana' ? '@moobitech/meridiana' : `@moobitech/meridiana-${name}`,
          link: `/${name}/README`,
        })),
      },
      {
        text: 'License',
        items: [
          { text: 'Pricing', link: '/docs/pricing' },
          { text: 'Licensing', link: '/docs/licensing' },
          { text: 'License agreement', link: '/LICENSE' },
          { text: 'Third-party notices', link: '/THIRD_PARTY_NOTICES' },
          { text: 'Roadmap', link: '/docs/roadmap' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/moobitech/meridiana-docs' }],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    footer: {
      message:
        'Commercial software, free for the web with the Community plan. <a href="/LICENSE">License agreement</a>',
      copyright: '© Moobi Tech S.r.l.s. · VAT IT04871490407',
    },
  },
});
