<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { PREVIEWS } from './previews';
import { DEMO_PATH, LIVE_DEMO } from './showcase';
import { onTabKeydown } from './tabs';

// A live example of a doc page (`<!-- preview <id> -->` in its Markdown, see markdown.ts): the React
// demo built for /demo/ draws the example `id` alone (apps/demo-react, previews.tsx), in a frame
// that takes its height; the code blocks of the Markdown are the Code tab. The first two examples
// of a page are `eager`, the others load when they come near the viewport.
const props = defineProps<{ id: string; eager?: boolean }>();

const { isDark } = useData();
const uid = useId();
const tab = ref<'preview' | 'code'>(LIVE_DEMO ? 'preview' : 'code');
const frame = ref<HTMLIFrameElement>();
const src = ref<string>();
const height = ref<number>();

const info = computed(() => PREVIEWS[props.id]);
const title = computed(() => `Live example: ${info.value?.title ?? props.id.replace(/-/g, ' ')}`);
const demoLink = computed(() =>
  info.value?.view ? withBase(`${DEMO_PATH}?view=${info.value.view}`) : undefined,
);
// Until the example tells its height, the frame keeps the measured one
const reserved = computed(() => {
  const [phone, wide] = info.value?.height ?? [480, 480];

  return { '--preview-phone': `${phone}px`, '--preview-wide': `${wide}px` };
});

function resize(event: MessageEvent) {
  const data = event.data;
  if (event.origin !== window.location.origin || data?.type !== 'meridiana-preview-size') return;
  if (data.id === props.id && typeof data.height === 'number') height.value = data.height;
}

// The example starts with the theme of the site, so its address is set in the browser only. The
// address names index.html: `vitepress dev` serves the public demo by file, not by folder.
onMounted(() => {
  window.addEventListener('message', resize);
  src.value = withBase(
    `${DEMO_PATH}index.html?preview=${encodeURIComponent(props.id)}&theme=${isDark.value ? 'dark' : 'light'}`,
  );
});
onBeforeUnmount(() => window.removeEventListener('message', resize));

watch(isDark, (dark) => {
  frame.value?.contentWindow?.postMessage(
    { type: 'meridiana-demo-theme', dark },
    window.location.origin,
  );
});
</script>

<template>
  <div class="doc-preview" :class="{ 'is-code': tab === 'code' }">
    <div v-if="LIVE_DEMO" class="doc-preview-head">
      <div class="doc-preview-tabs" role="tablist" aria-label="Example" @keydown="onTabKeydown">
        <button
          :id="`${uid}-tab-preview`"
          type="button"
          role="tab"
          :aria-selected="tab === 'preview'"
          :aria-controls="`${uid}-panel-preview`"
          :tabindex="tab === 'preview' ? 0 : -1"
          @click="tab = 'preview'"
        >
          Preview
        </button>
        <button
          :id="`${uid}-tab-code`"
          type="button"
          role="tab"
          :aria-selected="tab === 'code'"
          :aria-controls="`${uid}-panel-code`"
          :tabindex="tab === 'code' ? 0 : -1"
          @click="tab = 'code'"
        >
          Code
        </button>
      </div>
      <a v-if="demoLink" class="doc-preview-open" :href="demoLink" target="_blank" rel="noopener">
        Open in the demo<span aria-hidden="true"> ↗</span>
      </a>
    </div>
    <div
      v-if="LIVE_DEMO"
      v-show="tab === 'preview'"
      :id="`${uid}-panel-preview`"
      class="doc-preview-stage vp-raw"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-preview`"
      :style="reserved"
    >
      <p v-if="!height" class="doc-preview-loading" aria-hidden="true">Loading example…</p>
      <iframe
        ref="frame"
        :src="src"
        :class="{ ready: height }"
        :style="height ? { height: `${height}px` } : undefined"
        :title="title"
        :loading="eager ? 'eager' : 'lazy'"
      ></iframe>
    </div>
    <div
      v-show="tab === 'code'"
      :id="`${uid}-panel-code`"
      class="doc-preview-code"
      :role="LIVE_DEMO ? 'tabpanel' : undefined"
      :aria-labelledby="LIVE_DEMO ? `${uid}-tab-code` : undefined"
    >
      <slot />
    </div>
  </div>
</template>
