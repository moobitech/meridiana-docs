<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<!-- Social proof under the product: the application of Moobi Tech that runs on Meridiana -->
<template>
  <section class="used-by vp-raw" aria-labelledby="used-by-title">
    <p id="used-by-title" class="label">In production at</p>
    <img
      class="logo only-light"
      :src="withBase('/landing/willness.png')"
      width="1024"
      height="452"
      alt="Willness"
    />
    <img
      class="logo only-dark"
      :src="withBase('/landing/willness-negative.png')"
      width="1024"
      height="452"
      alt="Willness"
    />
    <p class="text">
      The management software of Italian gyms and sports clubs draws its classes and bookings with
      Meridiana.
    </p>
  </section>
</template>

<style scoped>
.used-by {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 24px;
  margin-top: 40px;
  text-align: center;
}

.label {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.logo {
  display: block;
  width: auto;
  height: 48px;
}

.text {
  max-width: 420px;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}
@media (max-width: 639px) {
  .text {
    text-align: center;
  }
}

.dark .only-light,
html:not(.dark) .only-dark {
  display: none;
}
</style>
