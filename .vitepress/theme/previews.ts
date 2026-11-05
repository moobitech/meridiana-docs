// What the site knows of each live example (apps/demo-react, previews.tsx): its name for screen
// readers, the view of the demo it opens, and its height before it loads, on phones and wider
// screens (measured on the built site), so that the page does not jump when it arrives.

interface PreviewInfo {
  title: string;
  /** The `?view=` of the demo that "Open in the demo" opens; none for the theme swatches. */
  view?: 'agenda' | 'day' | 'three-days' | 'week' | 'month';
  /** Height in pixels: under 640px, then from 640px. */
  height: [number, number];
}

export const PREVIEWS: Record<string, PreviewInfo> = {
  'first-calendar': {
    title: 'The week of October 12, 2026 with one event, Yoga',
    view: 'week',
    height: [273, 273],
  },
  week: { title: 'The week view with sample events', view: 'week', height: [590, 590] },
  'three-days': {
    title: 'The 3 days view with sample events',
    view: 'three-days',
    height: [590, 590],
  },
  day: { title: 'The day view with sample events', view: 'day', height: [590, 590] },
  'work-week': { title: 'A week without Saturday and Sunday', view: 'week', height: [590, 590] },
  'drag-resize': {
    title: 'A week whose events can be dragged and resized',
    view: 'week',
    height: [670, 670],
  },
  'context-menu': {
    title: 'Three days with menus on events and empty slots',
    view: 'three-days',
    height: [622, 622],
  },
  'custom-event': {
    title: 'Three days whose events show their room',
    view: 'three-days',
    height: [590, 590],
  },
  'overlap-cascade': {
    title: 'Four overlapping events in a cascade',
    view: 'day',
    height: [361, 361],
  },
  'overlap-columns': {
    title: 'Four overlapping events in columns',
    view: 'day',
    height: [361, 361],
  },
  month: { title: 'The month view with sample events', view: 'month', height: [626, 710] },
  'month-menu': {
    title: 'The month view with two rows a day, its "+N" and menus on days and events',
    view: 'month',
    height: [658, 658],
  },
  agenda: { title: 'The agenda of three days', view: 'agenda', height: [412, 412] },
  'agenda-empty-days': {
    title: 'The agenda of a week, with the days without events',
    view: 'agenda',
    height: [808, 808],
  },
  'theme-tokens': {
    title: 'The color tokens of the default theme with their values',
    height: [1062, 407],
  },
  'theme-colors': {
    title: 'A week with the teal colors of the example',
    view: 'week',
    height: [590, 590],
  },
};
