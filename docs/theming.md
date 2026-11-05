# Theming

Meridiana has no stylesheet of its own. Every element it draws takes its Tailwind classes from a
**slot** of the theme (`event`, `dayHeader`, `monthCell`, …). States are not separate classes: the
element carries `data-*` attributes and the theme styles them with Tailwind variants, for example
`data-today:bg-indigo-50` or `data-dragging:opacity-80`. A variant is more specific than a plain
utility, so a state always wins over the base style of its slot, without `tailwind-merge`.

There are three levels of customization. Pick a theme above the example: the code beside it is
the code of that theme.

<!-- preview theme-switcher -->

<!-- tabs -->

```tsx [Default]
// Default
import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-react';

// The default theme: the classes of the slots and the --mer-* tokens of @moobitech/meridiana
<MeridianaProvider weekStartsOn={1}>
  <MeridianaTimeGrid
    events={events}
    viewDate={new Date()}
    days={7}
    dayStart={{ hour: 8, minute: 0 }}
    dayEnd={{ hour: 18, minute: 0 }}
    segmentHeight={24}
    responsive
  />
</MeridianaProvider>;
```

```css [Brand]
/* Brand */
/* Your Tailwind entry: the tokens of your brand after the import */
@import '@moobitech/meridiana';

:root {
  --mer-accent: #0f766e;
  --mer-today: #f0fdfa;
  --mer-default-event-bg: #ccfbf1;
  --mer-default-event-border: #0f766e;
  --mer-default-event-text: #134e4a;
}

.dark {
  --mer-accent: #2dd4bf;
  --mer-accent-contrast: #042f2e;
  --mer-today: #134e4a;
  --mer-default-event-bg: #134e4a;
  --mer-default-event-border: #2dd4bf;
  --mer-default-event-text: #ccfbf1;
}
```

```tsx [Design system]
// Design system
import { createMeridianaTheme } from '@moobitech/meridiana-core';

// Slots that replace the default classes: the look of your own design system
const theme = createMeridianaTheme({
  timeGrid: 'relative overflow-auto rounded-2xl border border-stone-200 bg-stone-50',
  timeGridHeader: 'border-b border-stone-200 bg-stone-50',
  timeGutter: 'border-r border-stone-200 text-right',
  timeLabel: 'pr-2 text-xs text-stone-500',
  allDayRow: 'border-b border-stone-200 bg-stone-100',
  dayHeader: 'flex flex-col items-center gap-1 py-3 text-stone-500 data-today:text-orange-700',
  dayHeaderDate: 'text-2xl font-light',
  dayColumn: 'relative border-r border-stone-200 last:border-r-0 data-today:bg-orange-50',
  slot: 'border-b border-stone-200/60 data-hour-start:border-stone-200',
  event:
    'absolute overflow-hidden rounded-xl bg-white px-2 py-1.5 text-xs text-stone-600 shadow-sm ' +
    'ring-1 ring-stone-200 data-dragging:shadow-lg data-stacked:ring-stone-300',
  eventTitle: 'truncate font-semibold text-stone-900',
});

<MeridianaProvider weekStartsOn={1} theme={theme}>
  <MeridianaTimeGrid
    events={events}
    viewDate={new Date()}
    days={7}
    dayStart={{ hour: 8, minute: 0 }}
    dayEnd={{ hour: 18, minute: 0 }}
    segmentHeight={24}
    responsive
  />
</MeridianaProvider>;
```

```css [Dark]
/* Dark */
/* Your Tailwind entry: the dark palette of the tokens follows the .dark class, e.g. on <html> */
@import 'tailwindcss';
@import '@moobitech/meridiana';

@custom-variant dark (&:where(.dark, .dark *));
```

<!-- /tabs -->

<!-- /preview -->

## 1. Colors only: CSS variables

The default web theme reads its colors from the `--mer-*` variables of
`@moobitech/meridiana`, which you already import. Override what you need after it:

```css
@import '@moobitech/meridiana';

:root {
  --mer-accent: #0f766e;
  --mer-today: #f0fdfa;
  --mer-default-event-bg: #ccfbf1;
  --mer-default-event-border: #0f766e;
  --mer-default-event-text: #134e4a;
}

/* Dark mode, with the .dark class */
.dark {
  --mer-accent: #2dd4bf;
  --mer-accent-contrast: #042f2e;
  --mer-today: #134e4a;
  --mer-default-event-bg: #134e4a;
  --mer-default-event-border: #2dd4bf;
  --mer-default-event-text: #ccfbf1;
}
```

This is "Brand" in the example at the top of this page.

The events of the example have no color of their own, so they take the default event colors. The
tokens of the default theme, in `@moobitech/meridiana/theme.css`:

| Variable | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--mer-surface` | `#ffffff` | `#1e293b` | the background of the grid |
| `--mer-surface-alt` | `#f8fafc` | `#172033` | weekends and past days |
| `--mer-surface-hover` | `#f1f5f9` | `#334155` | hover |
| `--mer-border` | `#e2e8f0` | `#334155` | lines and borders |
| `--mer-text` | `#334155` | `#e2e8f0` | text |
| `--mer-text-muted` | `#94a3b8` | `#94a3b8` | secondary text |
| `--mer-weekend` | `#ef4444` | `#f87171` | weekend day names |
| `--mer-today` | `#eef2ff` | `#312e81` | the background of today |
| `--mer-accent` | `#4f46e5` | `#818cf8` | today's number, active buttons |
| `--mer-accent-contrast` | `#ffffff` | `#1e1b4b` | text on the accent |
| `--mer-now` | `#ef4444` | `#f87171` | the current-time line |
| `--mer-ok` | `#22c55e` | `#4ade80` | status dot ok |
| `--mer-warning` | `#f59e0b` | `#fbbf24` | status dot warning |
| `--mer-danger` | `#ef4444` | `#f87171` | status dot danger, invalid previews, danger menu entries |
| `--mer-default-event-bg` | `#e0e7ff` | `#312e81` | the background of the events without a color of their own |
| `--mer-default-event-border` | `#4f46e5` | `#818cf8` | their bar |
| `--mer-default-event-text` | `#312e81` | `#e0e7ff` | their text |

Dark mode follows the `.dark` class: the tokens have a dark palette under `.dark`. Add
`@custom-variant dark (&:where(.dark, .dark *));` to your Tailwind entry to toggle it with the class.

The colors of a single event (`event.color`) arrive on that event as `--mer-event-border` and
`--mer-event-color` (`primary`), `--mer-event-bg` (`secondary`) and `--mer-event-text` (`text`). The
default theme reads them first and falls back to `--mer-default-event-*`. Never set `--mer-event-*`
on `:root`: it would replace the fallback of every event without that color.

The other live examples of these docs set a few tokens to match the site: zinc greys, a lighter
tint for today, weekend names in the muted color, slightly tighter event times, and in Month the days
of the other months at full opacity. Without them you get the default theme, as in the table above and the example at the top of this
page.

## 2. Small changes: extend the default theme

`createMeridianaTheme` builds a complete theme from the slots you give. In `extend` mode your
classes are appended to the default ones:

```ts
import { createMeridianaTheme } from '@moobitech/meridiana-core';

const theme = createMeridianaTheme(
  { event: 'font-semibold shadow-md', dayHeaderDate: 'text-2xl' },
  { mode: 'extend' },
);
```

Pass it to the provider (`provideMeridiana({ theme })`, `<MeridianaProvider theme={theme}>`) or to
the `theme` input of a single view.

## 3. Your design system: replace the slots

Give the slots your own classes: each slot you pass replaces the default classes (`replace` mode,
the default). This is how an admin kit or a company design system gets a calendar that looks
native to it:

```ts
provideMeridiana({
  theme: {
    event:
      'absolute overflow-hidden rounded-lg border-l-4 bg-white px-2.5 py-1.5 text-xs shadow-xs ' +
      'data-dragging:shadow-lg data-invalid:ring-2 data-invalid:ring-red-500 data-stacked:ring-1 data-stacked:ring-white',
    eventTitle: 'line-clamp-2 font-medium text-slate-700',
    dayHeader: 'flex flex-col items-center py-2 data-today:text-primary',
    // …
  },
});
```

Keep the layout classes of the slots you replace (`absolute` on `event`, `flex` on `dayHeader`…):
the defaults in `meridianaDefaultTheme` are a good starting point to copy.

To use the colors of the events, read their variables with a fallback of your design system, for
the events whose color lacks that part:

```ts
event: 'border-l-4 border-[var(--mer-event-border,var(--color-primary))] bg-[var(--mer-event-bg,white)] …',
```

## Slots and states

Every slot, the element it styles and its `data-*` states are listed in
[Theme slots](api/theme-slots.md), with `createMeridianaTheme` and `MERIDIANA_SLOT_STATES`.

## Tailwind sources

The theme classes live in the JavaScript of the packages and in your theme file, so Tailwind must
scan both. Tailwind v4 detects your own sources but skips `node_modules`; import
`@moobitech/meridiana` for the packages (see [Installation](getting-started.md#2-tailwind-css)).
Import it with your own theme too: the components carry layout
classes that no slot replaces.

```css
@import 'tailwindcss';
@import '@moobitech/meridiana';
```

Without it there is no error: the classes that your app does not use elsewhere are missing, and some
elements are out of place.

## React Native

React Native has no cascading text styles and no per-element CSS variables, so the native theme
(`meridianaNativeTheme`) differs in three ways:

- **Text slots**: elements that hold a label have a separate slot for the text:
  `contextMenuItemText`, `monthDayNumberText`, `monthEventText`, `agendaDayHeaderText`,
  `agendaItemText`. Text classes (`text-*`, `font-*`) go on the text slots.
- **States** are `data-*` props with the value `true`, as Uniwind expects; the `data-today:` variants
  are written the same way.
- **Event colors** are applied as styles, over the theme classes.

The default native theme uses the color tokens of **gluestack-ui** (`bg-background`,
`text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-muted`,
`text-destructive`, …): an Expo app with gluestack-ui and Uniwind gets a calendar in its colors and
dark mode. Without gluestack-ui, define those colors in your Uniwind theme or replace the slots:

```tsx
import { MeridianaProvider } from '@moobitech/meridiana-native';

<MeridianaProvider theme={{ event: 'absolute overflow-hidden rounded-xl border-l-4 bg-white px-2 py-1' }}>
  …
</MeridianaProvider>;
```
