// The framework and the package manager the reader picked, remembered in the browser and shared by
// every tab group of the site: the install tabs (InstallTabs.vue) and the code groups whose tabs
// are named after a framework (`<!-- tabs -->` with [Angular], [React], …).
import { ref, watch } from 'vue';

export const FRAMEWORKS = ['Angular', 'React', 'React Native'];

const FRAMEWORK_KEY = 'meridiana-docs-framework';
const MANAGER_KEY = 'meridiana-docs-package-manager';

export const framework = ref<string>();
export const manager = ref('pnpm');

let loaded = false;

/** Reads the saved choices once, in the browser. */
export function loadChoices() {
  if (loaded || typeof window === 'undefined') return;

  loaded = true;
  framework.value = read(FRAMEWORK_KEY) ?? undefined;
  manager.value = read(MANAGER_KEY) ?? 'pnpm';
  watch(framework, (value) => {
    if (!value) return;

    write(FRAMEWORK_KEY, value);
    // A framework picked in the install tabs selects it in the code groups too
    requestAnimationFrame(syncCodeGroups);
  });
  watch(manager, (value) => write(MANAGER_KEY, value));
}

/**
 * Selects the saved framework in the VitePress code groups of the page, and saves the one the
 * reader clicks. Call it after every page change.
 */
export function syncCodeGroups() {
  loadChoices();
  if (!framework.value) return;

  for (const label of document.querySelectorAll<HTMLLabelElement>('.vp-code-group .tabs label')) {
    if (label.dataset.title !== framework.value) continue;

    const input = document.getElementById(label.htmlFor) as HTMLInputElement | null;
    if (input && !input.checked) input.click();
  }
}

/** The click handler of the code groups (installed once). */
export function watchCodeGroupClicks() {
  window.addEventListener('click', (event) => {
    const label = (event.target as Element | null)?.closest?.('.vp-code-group .tabs label');
    const title = (label as HTMLLabelElement | null)?.dataset.title;
    if (!title || !FRAMEWORKS.includes(title) || !event.isTrusted) return;

    // The others follow (the watcher of loadChoices), after VitePress has switched this group
    framework.value = title;
  });
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the choice lasts until the page closes
  }
}
