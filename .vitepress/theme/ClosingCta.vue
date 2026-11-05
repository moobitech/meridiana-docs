<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<!-- The end of the home page: the same first step as the hero, and the plans -->
<template>
  <section class="closing vp-raw">
    <h2>Put a calendar in your app today</h2>
    <p>
      Install Meridiana from npm and evaluate it for 30 days in a non-production environment, no key
      needed.
    </p>

    <div class="actions">
      <a class="button primary" :href="withBase('/docs/getting-started')">Get started</a>
      <a class="button secondary" :href="withBase('/docs/pricing')">See the plans</a>
    </div>
  </section>
</template>

<style scoped>
.closing {
  margin-top: 72px;
  padding: 48px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}

h2 {
  margin: 0;
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
p {
  max-width: 560px;
  margin: 12px auto 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}
</style>
