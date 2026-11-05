<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue';
import { PACKAGE_MANAGERS } from '../markdown';
import { framework, FRAMEWORKS, loadChoices, manager } from './choices';
import { onTabKeydown } from './tabs';

// The install commands of a page (`<!-- install -->` in its Markdown, expanded by markdown.ts): one
// block per framework and package manager, of which one is shown, in one tab panel that both tab
// lists control
const props = defineProps<{ frameworks: string[] }>();

const root = ref<HTMLElement>();
const panel = `${useId()}-panel`;
// The frameworks in the order of every tab group of the site
const named = computed(() =>
  props.frameworks.filter(Boolean).sort((a, b) => FRAMEWORKS.indexOf(a) - FRAMEWORKS.indexOf(b)),
);
const shown = computed(() =>
  framework.value && named.value.includes(framework.value)
    ? framework.value
    : (named.value[0] ?? props.frameworks[0]),
);

function show() {
  for (const block of root.value?.querySelectorAll<HTMLElement>('.install-block') ?? []) {
    block.hidden = block.dataset.fw !== shown.value || block.dataset.pm !== manager.value;
  }
}

onMounted(() => {
  loadChoices();
  nextTick(show);
});
watch([shown, manager], show);
</script>

<template>
  <div ref="root" class="install-tabs">
    <div class="install-head">
      <div
        v-if="named.length > 1"
        class="install-frameworks"
        role="tablist"
        aria-label="Framework"
        @keydown="onTabKeydown"
      >
        <button
          v-for="name in named"
          :key="name"
          type="button"
          role="tab"
          :aria-selected="name === shown"
          :aria-controls="panel"
          :tabindex="name === shown ? 0 : -1"
          @click="framework = name"
        >
          {{ name }}
        </button>
      </div>
      <div
        class="install-managers"
        role="tablist"
        aria-label="Package manager"
        @keydown="onTabKeydown"
      >
        <button
          v-for="pm in PACKAGE_MANAGERS"
          :key="pm"
          type="button"
          role="tab"
          :aria-selected="pm === manager"
          :aria-controls="panel"
          :tabindex="pm === manager ? 0 : -1"
          @click="manager = pm"
        >
          {{ pm }}
        </button>
      </div>
    </div>
    <div :id="panel" role="tabpanel" :aria-label="shown ? `${shown}, ${manager}` : manager">
      <slot />
    </div>
  </div>
</template>
