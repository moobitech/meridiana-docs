# Theme slots

A theme is an object of Tailwind class strings, one per **slot**: every element a view draws takes
its classes from one slot. States are `data-*` attributes on the element, styled with variants such
as `data-today:` or `data-dragging:`. How to restyle step by step: [Theming](../theming.md).

## API

| Export | Type | Description |
| --- | --- | --- |
| `MeridianaTheme` | `Record<MeridianaSlot, string>` | A complete theme: the classes of every slot. |
| `MeridianaSlot` | union of the slot names | The names in the table below. |
| `meridianaDefaultTheme` | `MeridianaTheme` | The default web theme, which reads the `--mer-*` color tokens. |
| `createMeridianaTheme(slots, options?)` | `(Partial<MeridianaTheme>, CreateThemeOptions) => MeridianaTheme` | A complete theme from the slots you give. |
| `MERIDIANA_SLOT_STATES` | `Partial<Record<MeridianaSlot, readonly string[]>>` | The `data-*` states of each slot. |

`CreateThemeOptions`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `base` | `MeridianaTheme` | `meridianaDefaultTheme` | The theme the slots start from. |
| `mode` | `'replace' \| 'extend'` | `'replace'` | `replace`: a slot you give replaces the base classes. `extend`: it is appended to them. |

```ts
import { createMeridianaTheme } from '@moobitech/meridiana-core';

const theme = createMeridianaTheme(
  { event: 'font-semibold shadow-md', dayHeaderDate: 'text-2xl' },
  { mode: 'extend' },
);
```

Pass a theme, or just a few slots, to the provider (`provideMeridiana({ theme })`,
`<MeridianaProvider theme={theme}>`) or to the `theme` input of one view, which wins over the
provider.

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
| `event` | an event box, in every view's time grid and all-day row | `dragging`, `invalid`, `disabled`, `starts-before`, `ends-after`, `all-day`, `stacked`, `narrow`, `compact` (shorter than two lines: the title only, centred); React Native also `selected` |
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

React Native has its own theme, `meridianaNativeTheme` (`MeridianaNativeTheme`), with separate text
slots (`contextMenuItemText`, `monthDayNumberText`, `monthEventText`, `agendaDayHeaderText`,
`agendaItemText`) and states whose value is `true`: see [Theming](../theming.md#react-native).
