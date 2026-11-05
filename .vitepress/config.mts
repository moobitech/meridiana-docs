// Meridiana — site of github.com/moobitech/meridiana-docs, published on GitHub Pages at
// https://meridiana.moobitech.it. tools/export-docs.mjs copies site/ to the root of the docs
// repository, next to the docs: the pages are those Markdown files, at their own paths (/docs/…), so
// their relative links work on GitHub and here alike.
import { type DefaultTheme, defineConfigWithTheme } from 'vitepress';
import { docsMarkdown } from './markdown';
import { latestRelease, type Release } from './release';
import { darkCode, lightCode } from './shiki';
import { DEMO_PATH, LIVE_DEMO } from './theme/showcase';

/** The anchor GitHub gives a heading: lower case, punctuation dropped, spaces to dashes. */
function githubSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

const link = ([text, link]: string[]) => ({ text, link });

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Get started',
    items: [
      ['Installation', '/docs/getting-started'],
      ['Licensing', '/docs/licensing'],
      ['Troubleshooting', '/docs/troubleshooting'],
    ].map(link),
  },
  {
    text: 'Components',
    items: [
      ['Time grid', '/docs/time-grid'],
      ['Month', '/docs/month'],
      ['Agenda', '/docs/agenda'],
    ].map(link),
  },
  {
    text: 'Guide',
    items: [
      ['Events and interactions', '/docs/events-and-interactions'],
      ['Theming', '/docs/theming'],
      ['Angular', '/docs/angular'],
      ['React', '/docs/react'],
      ['React Native', '/docs/react-native'],
    ].map(link),
  },
  {
    text: 'API',
    items: [
      ...[
        ['Core engine', '/docs/core'],
        ['Event model', '/docs/api/event-model'],
        ['Provider and options', '/docs/api/provider'],
        ['Theme slots', '/docs/api/theme-slots'],
        ['Hooks and helpers', '/docs/api/hooks-and-helpers'],
      ].map(link),
      {
        // The READMEs of the npm packages, at their own paths: the same files npm and GitHub show,
        // in one collapsed item
        text: 'Packages',
        collapsed: true,
        items: ['meridiana', 'core', 'angular', 'react', 'native'].map((name) => ({
          text: name === 'meridiana' ? '@moobitech/meridiana' : `meridiana-${name}`,
          link: `/${name}/README`,
        })),
      },
    ],
  },
];

export default defineConfigWithTheme<DefaultTheme.Config & { release?: Release }>({
  title: 'Meridiana',
  description:
    'Calendar and scheduler components for Angular, React and React Native, styled with Tailwind CSS.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: false,
  // The README is the landing page on GitHub; here the home page (index.md) takes its place
  srcExclude: ['README.md', 'node_modules/**'],
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    [
      'link',
      {
        rel: 'preload',
        href: '/fonts/Geist-Variable.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: '',
      },
    ],
  ],
  markdown: {
    // The anchors of the headings as GitHub makes them (`## 2. Tailwind CSS` → `#2-tailwind-css`), so the
    // links between the Markdown files work on both: VitePress would write `#_2-tailwind-css`
    anchor: { slugify: githubSlug },
    theme: { light: lightCode, dark: darkCode },
    config: docsMarkdown,
  },
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
        // Every page of the sidebar: one item for all of them
        activeMatch: '^/(docs|core|angular|react|native|meridiana)/(?!pricing|roadmap)',
      },
      { text: 'Pricing', link: '/docs/pricing' },
      { text: 'Roadmap', link: '/docs/roadmap' },
      ...(LIVE_DEMO ? [{ text: 'Demo', link: DEMO_PATH, target: '_blank' }] : []),
    ],
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/moobitech/meridiana-docs' }],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    footer: {
      message: [
        'Made by Moobi Tech',
        '<a href="/LICENSE">License agreement</a>',
        '<a href="/THIRD_PARTY_NOTICES">Third-party notices</a>',
        '<a href="https://github.com/moobitech/meridiana-docs">Docs on GitHub</a>',
      ].join(' · '),
      copyright: '© Moobi Tech S.r.l.s. · VAT IT04871490407',
    },
    // The announcement badge of the home page (HomeHero)
    release: latestRelease(),
  },
});
