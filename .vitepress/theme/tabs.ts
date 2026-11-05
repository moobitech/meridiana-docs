// The keyboard of the tab lists of the site (DocPreview.vue, InstallTabs.vue), as the ARIA tabs
// pattern has it: arrows move to the previous or next tab and select it, Home and End to the first
// and the last. Only the selected tab is in the Tab order (tabindex 0, the others -1).
export function onTabKeydown(event: KeyboardEvent) {
  const list = event.currentTarget as HTMLElement;
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
  const index = tabs.indexOf(event.target as HTMLElement);
  if (index < 0) return;

  const next = {
    ArrowRight: (index + 1) % tabs.length,
    ArrowDown: (index + 1) % tabs.length,
    ArrowLeft: (index - 1 + tabs.length) % tabs.length,
    ArrowUp: (index - 1 + tabs.length) % tabs.length,
    Home: 0,
    End: tabs.length - 1,
  }[event.key];
  if (next === undefined) return;

  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}
