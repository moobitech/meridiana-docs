<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import type { Release } from '../release';

const { theme } = useData();
const release = theme.value.release as Release | undefined;
</script>

<!-- The top of the home page: the latest release, the promise, the two actions -->
<template>
  <section class="hero vp-raw">
    <a v-if="release" class="announcement" :href="withBase(release.link)">
      <span class="version">New in {{ release.version }}</span>
      <span class="headline">{{ release.headline ?? 'See what changed' }}</span>
      <span aria-hidden="true">→</span>
    </a>

    <h1>The calendar your booking app deserves</h1>
    <p class="lead">
      Agenda, Day, Week and Month views for Angular, React and React Native, styled with Tailwind
      CSS.
    </p>

    <div class="actions">
      <a class="button primary" :href="withBase('/docs/getting-started')">Get started</a>
      <a class="button secondary" href="#demo">See it in action</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 0 40px;
  text-align: center;
}

.announcement {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  margin-bottom: 24px;
  padding: 4px 12px 4px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 20px;
  text-decoration: none;
  transition: border-color 0.2s;
}
.announcement:hover {
  border-color: var(--vp-c-brand-1);
}
.version {
  flex: none;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.headline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

h1 {
  max-width: 820px;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-wrap: balance;
}

.lead {
  max-width: 640px;
  margin: 20px 0 0;
  color: var(--vp-c-text-2);
  font-size: clamp(16px, 2.2vw, 19px);
  line-height: 1.55;
  text-wrap: balance;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}
</style>
