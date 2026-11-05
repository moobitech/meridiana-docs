<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { onMounted, ref, watch } from 'vue';
import { DEMO_PATH, LIVE_DEMO } from './showcase';

const { isDark } = useData();
const frame = ref<HTMLIFrameElement>();
const src = ref<string>();

// The demo starts with the theme of the site, so its address is set in the browser only
onMounted(() => {
  src.value = withBase(`${DEMO_PATH}?embed&theme=${isDark.value ? 'dark' : 'light'}`);
});

// Then it follows the switch of the site
watch(isDark, (dark) => {
  frame.value?.contentWindow?.postMessage(
    { type: 'meridiana-demo-theme', dark },
    window.location.origin,
  );
});
</script>

<!-- The product under the hero, the target of "See it in action": the live React demo, or the
     week view light or dark with the site (LIVE_DEMO in showcase.ts) -->
<template>
  <section id="demo" class="showcase vp-raw">
    <template v-if="LIVE_DEMO">
      <div class="frame live">
        <iframe
          ref="frame"
          :src="src"
          title="Live demo of Meridiana for React"
          loading="lazy"
        ></iframe>
      </div>
      <p class="caption">
        A live demo: drag and resize the events, right click one for its menu, switch the view.
        <a :href="withBase(DEMO_PATH)" target="_blank" rel="noopener">Open it full screen ↗</a>
      </p>
    </template>

    <figure v-else class="frame">
      <img
        class="only-light"
        :src="withBase('/landing/hero-light.png')"
        width="1248"
        height="746"
        alt="The week view of Meridiana: events with their times, overlapping events side by side, an all-day event and the current time"
      />
      <img
        class="only-dark"
        :src="withBase('/landing/hero-dark.png')"
        width="1248"
        height="746"
        alt="The week view of Meridiana in dark mode"
      />
    </figure>
  </section>
</template>

<style scoped>
.showcase {
  scroll-margin-top: calc(var(--vp-nav-height) + 24px);
}

.frame {
  margin: 0;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.35);
}
.frame img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.live iframe {
  display: block;
  width: 100%;
  height: 720px;
  border: 0;
  border-radius: 10px;
  background: var(--vp-c-bg);
}
/* On phones the demo takes the whole width, so the view switcher fits */
@media (max-width: 639px) {
  .frame.live {
    margin: 0 -24px;
    padding: 0;
    border-width: 1px 0;
    border-radius: 0;
  }
  .live iframe {
    height: 620px;
    border-radius: 0;
  }
}

.caption {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-align: center;
}
.caption a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
}

.dark .only-light,
html:not(.dark) .only-dark {
  display: none;
}
</style>
