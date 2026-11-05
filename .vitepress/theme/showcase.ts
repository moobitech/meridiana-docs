// The switch of the live demo on the home page.
//
// true: the home page embeds the React demo (apps/demo-react), which tools/export-docs.mjs builds
// into public/demo/ of the site, with the key in VITE_MERIDIANA_KEY (a key for
// meridiana.moobitech.it; without it the demo shows the watermark, and the export refuses to run on
// CI). false: the home page shows the screenshots of the week view (public/landing/hero-*.png) and
// the export builds no demo.
//
// Plain TypeScript without types: tools/export-docs.mjs imports this file with Node.
export const LIVE_DEMO = true;

/** Where the demo is published on the site. */
export const DEMO_PATH = '/demo/';
