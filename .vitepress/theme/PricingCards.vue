<script setup lang="ts">
import { useData } from 'vitepress';
import PlanCards from './PlanCards.vue';

const { page } = useData();
</script>

<!-- Above the Markdown of the pricing page, whose title and table are hidden here (style.css) -->
<template>
  <div v-if="page.relativePath === 'docs/pricing.md'" class="vp-doc">
    <h1>Pricing</h1>
    <p>Per application, with unlimited developers. The web views are free for small teams.</p>
    <PlanCards />
  </div>
</template>
