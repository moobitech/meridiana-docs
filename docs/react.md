# React

`@moobitech/meridiana-react` — function components for React 19 (DOM), with no dependency besides
React and the core. The context menu is built in.

```tsx
import {
  MeridianaAgenda,
  MeridianaMonthGrid,
  MeridianaProvider,
  MeridianaTimeGrid,
} from '@moobitech/meridiana-react';
```

Pass stable functions (`useCallback`) to `eventMenu`, `isEventDisabled` and the other function props:
a new function recomputes the view.

## `MeridianaTimeGrid` — Day, 3 days, Week

```tsx
<MeridianaTimeGrid
  events={events}
  viewDate={viewDate}
  days={7}
  responsive
  dayStart={{ hour: 8, minute: 0 }}
  dayEnd={{ hour: 20, minute: 0 }}
  maxHeight="70vh"
  draggable
  resizable
  validateChange={sameDay}
  eventMenu={eventMenu}
  slotMenu={slotMenu}
  showEventMenuButton
  renderEvent={({ event, timeLabel, compact, narrow }) => (
    <>
      <p className="font-medium">{event.title}</p>
      {!compact && !narrow && <p className="text-xs opacity-70">{timeLabel}</p>}
    </>
  )}
  onEventClick={open}
  onSlotClick={create}
  onEventChange={save}
  onVisibleDaysChange={setVisibleDays}
/>
```

Props: the same as the Angular inputs (see [Angular](angular.md#mer-time-grid--day-3-days-week)) —
`events`, `viewDate`, `days`, `weekStartsOn`, `excludeDays`, `fillExcludedDays`, `startsWithToday`,
`dayStart`, `dayEnd`, `segmentsPerHour`, `segmentHeight`, `eventGap`, `overlap`, `locale`,
`responsive`, `maxHeight`, `showSlotTime`, `theme`, `isSlotDisabled`, `isEventDisabled`,
`eventMenu`, `slotMenu`, `showEventMenuButton`, `eventMenuButtonLabel`, `draggable`, `resizable`,
`snapMinutes`, `validateChange` — with render props instead of templates:

| Prop | Receives |
| --- | --- |
| `renderEvent` | `{ event, placed, timeLabel, compact, roomy, narrow, disabled }` |
| `renderMenuItem` | the `CalendarMenuItem` |

Callbacks: `onEventClick`, `onSlotClick`, `onDayHeaderClick`, `onEventChange`, `onVisibleDaysChange`.

## `MeridianaMonthGrid` — Month

```tsx
<MeridianaMonthGrid
  events={events}
  viewDate={viewDate}
  maxEventsPerDay={3}
  moreLabel={(n) => `+${n} more`}
  dayMenu={dayMenu}
  eventMenu={eventMenu}
  onEventClick={open}
  onDayClick={openDay}
/>
```

Props: `events`, `viewDate`, `weekStartsOn`, `excludeDays`, `fixedWeeks`, `locale`,
`maxEventsPerDay`, `responsive` (dots under 640px, default `true`), `theme`, `isEventDisabled`,
`eventMenu`, `dayMenu`, `moreLabel`, `renderEvent(row)` (`row`: `{ event, timeLabel, disabled, … }`),
`renderMenuItem`. Callbacks: `onEventClick`, `onDayClick`.

## `MeridianaAgenda` — Agenda

```tsx
<MeridianaAgenda
  events={events}
  viewDate={viewDate}
  days={7}
  emptyLabel="Nothing planned"
  renderEvent={(row) => (
    <span className="flex flex-1 justify-between">
      {row.event.title}
      <small>{row.event.meta?.room}</small>
    </span>
  )}
  onEventClick={open}
  onDayClick={openDay}
/>
```

Props: `events`, `viewDate`, `days`, `excludeDays`, `showEmptyDays`, `locale`, `allDayLabel`,
`emptyLabel`, `theme`, `isEventDisabled`, `eventMenu`, `renderEvent(row)`, `renderMenuItem`.
Callbacks: `onEventClick`, `onDayClick`.

## Hooks without DOM

The views are built on hooks that compute everything and draw nothing. Import them from
`@moobitech/meridiana-react/hooks` (no `react-dom`) to build your own markup, or a renderer for
another platform — `@moobitech/meridiana-native` uses them.

| Hook | Returns |
| --- | --- |
| `useTimeGrid(options, width, gutter?)` | `columns` (days with slots and placed events, boxes in pixels and percent), `timeLabels`, `endLabel`, `nowLine`, `visibleDays`, `gridHeight`, `pixelsPerMinute` |
| `useMonthGrid(options)` | `weeks` of cells with rows, dots and "+N", `weekdays`, `title` |
| `useAgenda(options)` | days with their rows and time labels |
| `useMeridianaOptions()` | the provider options |
| `useMeridianaClasses(theme?)` | the merged theme |

Utilities: `eventColorStyle(event)` (CSS variables of an event), `flag(on)` (a `data-*` value),
`cx(...classes)`, `useContextMenu()` (`openAt` for `onContextMenu`, `openAtPoint`, `openBelow`) and
`ContextMenu` (the built-in menu, to reuse in your own components), `useLongPress()` (long press with
a finger, as the views use it for their menus).
