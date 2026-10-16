# Core engine

`@moobitech/meridiana-core` is plain TypeScript with `date-fns` as its only dependency. It computes
what the renderers draw: layouts, navigation, interactions and themes. Use it directly to build a
renderer for another framework, to draw a calendar on a canvas, or to test your own rules.

## Views

| Function | Returns |
| --- | --- |
| `getTimeGridView(options)` | Day, 3 days, Week: `days` (each with flags and placed events), `slots`, `allDay` bars, `totalMinutes`, `period` |
| `getMonthGridView(options)` | `weeks` of days with their events and multi-day spans, `weekDays`, `period` |
| `getAgendaView(options)` | `days` with their items (all-day, starts before, ends after), `period` |
| `getViewDays(options)` | the dates the time grid shows |

```ts
import { getTimeGridView } from '@moobitech/meridiana-core';

const view = getTimeGridView({
  viewDate: new Date(),
  days: 7,
  weekStartsOn: 1,
  dayStart: { hour: 8, minute: 0 },
  dayEnd: { hour: 20, minute: 0 },
  segmentsPerHour: 2,
  overlap: 'cascade',
  events,
});

for (const day of view.days) {
  for (const placed of day.events) {
    // placed.offsetMinutes, placed.durationMinutes: vertical position, in minutes
    // placed.left, placed.width: horizontal position, in percent of the column
    // placed.level: depth in the cascade; placed.startsBefore / endsAfter: clipped by the day
  }
}
```

Positions are in **minutes and percent**: each renderer chooses its pixels per minute. Positions are
read on the local wall clock, so the grid stays regular on the days the clocks change.

## Layout

- `layoutCascade(items, { sameStartMinutes, indent, maxIndent })` — the cascade of overlapping
  items (default of the time grid).
- `layoutColumns(items)` — overlapping items side by side, widening over free columns.
- `layoutSpans(days, events)` — horizontal bars over a row of days, in lanes (Month, all-day row).

## Navigation and formatting

- `navigate(mode, viewDate, 'previous' | 'next' | 'today', options)`
- `getViewPeriod(mode, viewDate, options)` — the range to load, end excluded
- `timeGridDays(mode)`
- `responsiveDays(requested, width, breakpoints?)`
- `formatDaysTitle(days, locale)`, `formatMonthTitle(date, locale)`, `formatTime`,
  `formatTimeRange`, `formatDayHeader`, `formatFullDate`, `formatShortDate`, `formatWeekday` — all
  with `Intl`

## Interactions

The same state machine drives the mouse on the web and the fingers on React Native:

```ts
import { startInteraction } from '@moobitech/meridiana-core';

const session = startInteraction(
  'move', // or 'resize-start' | 'resize-end'
  { event, dayIndex, offsetMinutes, durationMinutes }, // the grabbed piece
  origin, // pointer position in grid content coordinates
  {
    geometry: { columnWidth, dayCount, pixelsPerMinute, totalMinutes, snapMinutes },
    days, // the dates of the columns
    validate: (change) => true,
  },
);

const state = session.move(point); // state.preview { dayIndex, offsetMinutes, durationMinutes }, state.valid
const change = session.end(); // EventChange, or null when nothing moved or validate refused
```

For the keyboard, `startKeyboardInteraction(target, options)` takes the same target and options and
returns a session driven by steps instead of pointer positions: `move(days, steps)`,
`resize(steps)` (the end edge), `state` and `end()`. Steps are snap steps; the session keeps the
event inside the grid.

`createLongPress({ onLongPress, delay, tolerance })` tracks a long press of a finger from pointer
events, for renderers on browsers without `contextmenu` on touch (Safari on iOS).

Helpers: `moveEvent`, `resizeEvent` (apply a change by steps), `pointToSlot`,
`pointToMinutes`, `pointToDayIndex`, `snapMinutes`, `autoScrollSpeed`. The geometry helpers carry the
`'worklet'` directive, so they can run on the UI thread of Reanimated.

## Theme

`meridianaDefaultTheme`, `createMeridianaTheme(slots, { base, mode })`, the `MeridianaSlot` type and
`MERIDIANA_SLOT_STATES`. See [Theming](theming.md).

## License key

`setLicenseKey(key)` sets the key; the providers call it for you. `getLicenseStatus()` checks it
(offline, once per key) and returns `{ status: 'valid' | 'missing' | 'invalid' | 'expired', licensee?,
id?, exp? }`; the first time the key is not valid it warns in the console. `MERIDIANA_RELEASE_DATE`
is the release date of the running version. A custom renderer draws a watermark while the status is
not `valid`, as the built-in views do; `licenseNotice(status)` returns the text of their banner (empty
for a valid key). See [Licensing](licensing.md).
