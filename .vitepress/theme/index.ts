import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import PlanCards from './PlanCards.vue';
import PricingCards from './PricingCards.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  // The pricing page shows the plans as cards, above its Markdown (whose table is for GitHub)
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(PricingCards) }),
  enhanceApp({ app }) {
    app.component('PlanCards', PlanCards);
  },
} satisfies Theme;
