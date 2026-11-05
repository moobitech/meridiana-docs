<script setup lang="ts">
import { useData } from 'vitepress';
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

// A ```mermaid block of the docs (markdown.ts), drawn in the browser with mermaid, loaded only on
// the pages that have one. GitHub draws the same blocks by itself. Colors from the site (zinc, the
// indigo of Meridiana on the outlines), light and dark. A left-to-right flowchart wider than the
// page at its natural size (on phones, or a long one) is drawn top to bottom instead, so that its
// text keeps its size.
const props = defineProps<{ code: string }>();

const { isDark } = useData();
const id = `mermaid-${useId().replace(/[^\w-]/g, '')}`;
const root = ref<HTMLElement>();
const svg = ref('');
const failed = ref(false);
const source = decodeURIComponent(props.code);
let observer: ResizeObserver | undefined;
let width = 0;

const PALETTE = {
  light: {
    background: '#ffffff',
    primaryColor: '#fafafa',
    primaryBorderColor: '#a5b4fc',
    primaryTextColor: '#09090b',
    secondaryColor: '#eef2ff',
    tertiaryColor: '#ffffff',
    lineColor: '#71717a',
    textColor: '#09090b',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    background: '#09090b',
    primaryColor: '#18181b',
    primaryBorderColor: '#6366f1',
    primaryTextColor: '#fafafa',
    secondaryColor: '#1e1b4b',
    tertiaryColor: '#09090b',
    lineColor: '#a1a1aa',
    textColor: '#fafafa',
    edgeLabelBackground: '#09090b',
  },
};

const HORIZONTAL = /^(\s*)(flowchart|graph)\s+(LR|RL)\b/m;

/** The natural width of a drawn diagram, from its viewBox. */
function naturalWidth(markup: string) {
  return Number(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/.exec(markup)?.[1] ?? 0);
}

async function draw() {
  try {
    const { default: mermaid } = await import('mermaid');
    // The labels are measured with the font of the page: wait for it
    await document.fonts?.ready;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
      themeVariables: { ...PALETTE[isDark.value ? 'dark' : 'light'], fontSize: '14px' },
      // Labels as SVG text, measured in the font of the page (HTML labels were cut off)
      htmlLabels: false,
      flowchart: { htmlLabels: false, useMaxWidth: true, nodeSpacing: 32, rankSpacing: 36 },
    });
    let result = await mermaid.render(id, source);
    if (HORIZONTAL.test(source) && naturalWidth(result.svg) > width) {
      result = await mermaid.render(id, source.replace(HORIZONTAL, '$1$2 TD'));
    }
    svg.value = result.svg;
    failed.value = false;
  } catch {
    failed.value = true;
  }
}

onMounted(() => {
  // Drawn again when the room changes a lot (a phone turned, a window resized)
  observer = new ResizeObserver(([entry]) => {
    const next = Math.round(entry.contentRect.width);
    if (Math.abs(next - width) < 40) return;

    width = next;
    draw();
  });
  if (root.value) observer.observe(root.value);
});
onBeforeUnmount(() => observer?.disconnect());
watch(isDark, draw);
</script>

<!-- Before the diagram is drawn, and if it cannot be, the source stays readable -->
<template>
  <figure ref="root" class="mermaid-diagram">
    <div v-if="svg && !failed" class="mermaid-svg" v-html="svg"></div>
    <pre v-else class="mermaid-source"><code>{{ source }}</code></pre>
  </figure>
</template>
