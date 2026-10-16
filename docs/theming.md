# Theming

Meridiana has no stylesheet of its own. Every element it draws takes its Tailwind classes from a
**slot** of the theme (`event`, `dayHeader`, `monthCell`, …). States are not separate classes: the
element carries `data-*` attributes and the theme styles them with Tailwind variants, for example
`data-today:bg-indigo-50` or `data-dragging:opacity-80`. A variant is more specific than a plain
utility, so a state always wins over the base style of its slot, without `tailwind-merge`.

There are three levels of customization.

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
```

| Variable | Used for |
| --- | --- |
| `--mer-surface`, `--mer-surface-alt`, `--mer-surface-hover` | backgrounds: grid, weekends and past days, hover |
| `--mer-border` | lines and borders |
| `--mer-text`, `--mer-text-muted` | text, secondary text |
| `--mer-weekend` | weekend day names |
| `--mer-today` | background of today |
| `--mer-accent`, `--mer-accent-contrast` | today's number, active buttons |
| `--mer-now` | the current-time line |
| `--mer-ok`, `--mer-warning`, `--mer-danger` | status dots, invalid previews, danger menu entries |
| `--mer-default-event-bg`, `--mer-default-event-border`, `--mer-default-event-text` | colors of the events without a color of their own |

Dark mode follows the `.dark` class: the tokens have a dark palette under `.dark`. Add
`@custom-variant dark (&:where(.dark, .dark *));` to your Tailwind entry to toggle it with the class.

The colors of a single event (`event.color`) arrive on that event as `--mer-event-border` and
`--mer-event-color` (`primary`), `--mer-event-bg` (`secondary`) and `--mer-event-text` (`text`). The
default theme reads them first and falls back to `--mer-default-event-*`. Never set `--mer-event-*`
on `:root`: it would replace the fallback of every event without that color.

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

| Slot | Element | `data-*` states |
| --- | --- | --- |
| `root` | the host of every view | |
| `toolbar`, `toolbarTitle`, `toolbarButton`, `viewSwitcher`, `viewButton` | not drawn by the views: use them in your own toolbar to match | `toolbarButton`: `disabled`; `viewButton`: `active` |
| `dayHeader`, `dayHeaderWeekday`, `dayHeaderDate` | day headers of the time grid | `today`, `past`, `weekend` |
| `timeGrid`, `timeGridHeader`, `timeGutter`, `timeLabel`, `allDayRow` | time grid frame, hours | |
| `dayColumn` | a day column | `today`, `past`, `weekend` |
| `slot`, `slotLabel` | a segment of a column | `hour-start`, `disabled` |
| `nowIndicator` | the current-time line | |
| `event` | an event box, in every view's time grid and all-day row | `dragging`, `invalid`, `disabled`, `starts-before`, `ends-after`, `all-day`, `stacked`, `narrow`; React Native also `selected` |
| `eventTitle`, `eventTime`, `eventDescription` | texts of an event | |
| `eventStatus` | the status dot | `ok`, `warning`, `danger` |
| `eventMenuButton` | the "⋯" button | |
| `resizeHandle` | a resize handle | `edge-start`, `edge-end` |
| `contextMenu`, `contextMenuItem` | menu and its entries | `contextMenuItem`: `disabled`, `danger` |
| `monthGrid`, `monthWeekday` | Month frame, weekday names | |
| `monthCell` | a day of the Month | `today`, `past`, `weekend`, `outside` |
| `monthDayNumber` | its number | `today`, `outside` |
| `monthEvent`, `monthMore` | an event row, the "+N" link | `monthEvent`: `disabled` |
| `agenda`, `agendaDay`, `agendaDayHeader` | Agenda frame, a day, its header | `agendaDayHeader`: `today`, `weekend` |
| `agendaItem`, `agendaItemTime` | an Agenda row, its time | `agendaItem`: `all-day`, `disabled` |
| `agendaEmpty` | the empty message | |
| `eventDot` | the color dot (Month, Agenda) | |

The list is also exported as `MERIDIANA_SLOT_STATES`.

## Tailwind sources

The theme classes live in the JavaScript of the packages and in your theme file, so Tailwind must
scan both. Tailwind v4 detects your own sources but skips `node_modules`; import
`@moobitech/meridiana` for the packages (see [Getting started](getting-started.md#2-tailwind-css)).
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
