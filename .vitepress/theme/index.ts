import type { Theme } from 'vitepress';
import { onContentUpdated } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h, onMounted } from 'vue';
import { syncCodeGroups, watchCodeGroupClicks } from './choices';
import { watchTables } from './tables';
import ClosingCta from './ClosingCta.vue';
import DocLegal from './DocLegal.vue';
import DocPreview from './DocPreview.vue';
import FeatureGrid from './FeatureGrid.vue';
import HomeHero from './HomeHero.vue';
import InstallTabs from './InstallTabs.vue';
import LicenseRequest from './LicenseRequest.vue';
import PlanCards from './PlanCards.vue';
import PricingCards from './PricingCards.vue';
import Showcase from './Showcase.vue';
import UsedBy from './UsedBy.vue';
import './fonts.css';
import './style.css';
import './docs.css';

export default {
  extends: DefaultTheme,
  // The pricing page shows the plans as cards, above its Markdown (whose table is for GitHub); every
  // doc page ends with the legal links
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PricingCards),
      'doc-after': () => h(DocLegal),
    }),
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero);
    app.component('Showcase', Showcase);
    app.component('UsedBy', UsedBy);
    app.component('FeatureGrid', FeatureGrid);
    app.component('PlanCards', PlanCards);
    app.component('LicenseRequest', LicenseRequest);
    app.component('ClosingCta', ClosingCta);
    app.component('DocPreview', DocPreview);
    app.component('InstallTabs', InstallTabs);
  },
  // The code groups of the frameworks follow the framework the reader picked last; the wide tables
  // tell when they scroll
  setup() {
    onMounted(() => {
      watchCodeGroupClicks();
      watchTables();
    });
    onContentUpdated(() => {
      syncCodeGroups();
      watchTables();
    });
  },
} satisfies Theme;
