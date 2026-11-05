import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import ClosingCta from './ClosingCta.vue';
import FeatureGrid from './FeatureGrid.vue';
import HomeHero from './HomeHero.vue';
import LicenseRequest from './LicenseRequest.vue';
import PlanCards from './PlanCards.vue';
import PricingCards from './PricingCards.vue';
import Showcase from './Showcase.vue';
import UsedBy from './UsedBy.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  // The pricing page shows the plans as cards, above its Markdown (whose table is for GitHub)
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(PricingCards) }),
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero);
    app.component('Showcase', Showcase);
    app.component('UsedBy', UsedBy);
    app.component('FeatureGrid', FeatureGrid);
    app.component('PlanCards', PlanCards);
    app.component('LicenseRequest', LicenseRequest);
    app.component('ClosingCta', ClosingCta);
  },
} satisfies Theme;
