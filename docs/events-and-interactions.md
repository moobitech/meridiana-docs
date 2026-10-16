# Events and interactions

## The event model

Every view takes an array of `CalendarEvent<TMeta>` from `@moobitech/meridiana-core`:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string \| number` | Your id. Occurrences of a recurring event may share it: Meridiana tells them apart by `id` and `start`. |
| `start` | `Date` | |
| `end` | `Date?` | Excluded. Without it the event lasts 30 minutes in the time grid and one day elsewhere. |
| `title` | `string` | |
| `description` | `string?` | Shown under the title when the box is tall enough. Line breaks are kept. |
| `status` | `'ok' \| 'warning' \| 'danger'`? | A small colored dot next to the title, e.g. how full a class is. |
| `allDay` | `boolean?` | Drawn in the all-day row of the time grid. |
| `color` | `{ primary, secondary?, text? }`? | `primary`: the bar and the dot; `secondary`: the background; `text`: the text. |
| `cssClass` | `string?` | Extra classes on the event box (web). |
| `draggable` | `boolean?` | `false` keeps this event still when the view allows moving. |
| `resizable` | `{ start?, end? }`? | `false` on an edge keeps it fixed. |
| `meta` | `TMeta?` | Your own data. Meridiana never reads it; templates and callbacks receive it typed. |

Meridiana does not expand recurrences: pass the occurrences of the period you show.

## Clicks

| Callback (React / React Native) | Output (Angular) | When |
| --- | --- | --- |
| `onEventClick(event)` | `eventClick` | An event is clicked or tapped (not when disabled). |
| `onSlotClick(date)` | `slotClick` | An empty slot of the time grid; `date` is its start. |
| `onDayHeaderClick(date)` | `dayHeaderClick` | A day header of the time grid. |
| `onDayClick(date)` | `dayClick` | Month: the day number, the "+N" link or a compact cell. Agenda: a day header. |

## Disabled events and slots

- `isEventDisabled(event)` — the event ignores clicks, drag and resize, and looks dimmed
  (`data-disabled`). Its context menu still works: e.g. "Restore" on a cancelled event.
- `isSlotDisabled(date)` — the slot ignores clicks and has no menu (time grid).

## Context menus

Menus are lists of `CalendarMenuItem`:

```ts
interface CalendarMenuItem {
  label: string;
  icon?: string; // free value: draw it in your item template
  disabled?: boolean;
  danger?: boolean; // drawn with the danger color
  action: () => void;
}
```

| Input | View | Menu of |
| --- | --- | --- |
| `eventMenu(event)` | all | an event |
| `slotMenu(date)` | time grid | an empty slot |
| `dayMenu(date)` | month | a day cell |

An empty list means no menu (on the web the browser menu stays). How users open a menu:

| | Web (Angular, React) | React Native |
| --- | --- | --- |
| Event | right click, long press with a finger, the Menu key or Shift+F10, the "⋯" button (`showEventMenuButton`) | the "⋯" button; long press on events that cannot change |
| Empty slot | right click, long press with a finger | long press |
| Month cell | right click, long press with a finger | long press |
| Keyboard | arrows, Home, End, Enter, Escape | — |

On the web the long press is Meridiana's own (500 ms without moving the finger), because Safari on
iOS fires no `contextmenu` event. It opens the menu where the finger is; on Android the native
`contextmenu` that follows and the click of the release are ignored, so the menu opens once and the
event does not open. A finger that moves first drags the event or scrolls the grid.

Draw your own entries with `menuItemTemplate` (Angular) or `renderMenuItem` (React, React Native).

## Move and resize

Enable them on the time grid with `draggable` and `resizable`. The user drags; Meridiana snaps the
times to the grid and shows a preview; on release it reports an `EventChange`:

```ts
interface EventChange<T> {
  event: CalendarEvent<T>; // the event as it was
  kind: 'move' | 'resize-start' | 'resize-end';
  start: Date; // the new times
  end: Date;
}
```

**Meridiana does not change your events.** Save the change (and update your `events`), ask the
user first, or ignore it: the event goes back to its place.

```tsx
<MeridianaTimeGrid
  draggable
  resizable
  snapMinutes={15}
  validateChange={(change) => change.start.getHours() >= 8}
  onEventChange={(change) => api.save(change.event.id, change.start, change.end)}
/>
```

- **Snapping**: `snapMinutes`, default one segment of the grid (`60 / segmentsPerHour`).
- **Minimum length**: one snap step.
- **Validation**: `validateChange(change)` returning `false` shows the preview as invalid
  (`data-invalid`) and drops nothing. Use it for business rules: opening hours, same day only,
  no overlap with another event.
- **Auto-scroll**: dragging near the top or bottom edge scrolls the grid.
- **Moving to another day**: moves follow the pointer across columns. Forbid it with
  `validateChange` when your data cannot move an occurrence to another day.

| | Web | React Native |
| --- | --- | --- |
| Move | drag the event (a short click still opens it) | long press and drag; once selected, drag |
| Resize | drag the top or bottom edge | select the event (long press), then drag one of its two handles |
| Selection | — | tap an empty slot, another event or change period to end it |
| Keyboard | Space picks up the focused event; see below | — |

### Keyboard

On the web (Angular, React) a focused event that can move or resize is picked up with **Space**
(it carries `aria-keyshortcuts="Space"`). While it is picked up:

| Key | Does |
| --- | --- |
| Up / Down | moves it by one snap step |
| Left / Right | moves it by one day |
| Shift + Up / Down | moves its end by one snap step |
| Space or Enter | drops it: **one** `EventChange` (`onEventChange` / `eventChange`) |
| Escape, or leaving the event (Tab, click elsewhere) | puts it back, no change |

The preview is the same as with the pointer, `validateChange` marks it invalid, and the grid scrolls
to keep it in view. A live region announces the new day and times to screen readers. A move and a
resize in the same pick-up report one change: `kind: 'move'` when the start changed, otherwise
`'resize-end'`. Enter on an event that is not picked up opens it, as does Space on an event that
cannot change. The start edge resizes with the pointer only.

## Overlapping events

With `overlap: 'cascade'` (the default), events that start within 30 minutes of each other sit side
by side; an event that starts later is drawn one step in, reaches the right edge and lies over the
earlier ones (`data-stacked`). Titles stay readable with many overlaps. `overlap: 'columns'` splits
the column into equal parts instead.

A box narrower than 72px is *narrow* (`data-narrow`): it shows the title only and no "⋯" button; the
full text is in its tooltip (web).

## Navigation

The views show a period around `viewDate`; your app owns the toolbar. The core gives what it needs:

```ts
import { formatDaysTitle, getViewDays, getViewPeriod, navigate } from '@moobitech/meridiana-core';

const options = { weekStartsOn: 1, excludeDays: [0], agendaDays: 7 };

// Previous / Today / Next
viewDate = navigate('week', viewDate, 'next', options);

// The range to load from your API: start included, end excluded
const { start, end } = getViewPeriod('week', viewDate, options);

// A title such as "12–18 Oct 2026"
const title = formatDaysTitle(getViewDays({ viewDate, days: 7, weekStartsOn: 1 }), 'en-GB');
```

Modes: `'agenda'`, `'day'`, `'three-days'`, `'week'`, `'month'`. `timeGridDays(mode)` gives the
`days` input of the time grid (1, 3 or 7) and `undefined` for Agenda and Month.

| Option | Default | Notes |
| --- | --- | --- |
| `weekStartsOn` | `1` | |
| `excludeDays` | `[]` | Weekdays the views skip, e.g. `[0]` for no Sunday. |
| `fillExcludedDays` | `false` | Week only: keep seven columns by borrowing the next days. |
| `startsWithToday` | `false` | Week only: start from `viewDate`, not from the start of its week. |
| `agendaDays` | `30` | Days covered by the Agenda. |

### Responsive days

With `responsive`, the time grid shows one day up to 576px and three up to 768px, whatever `days`
asks. It reports the days it really shows (`onVisibleDaysChange` / `visibleDaysChange`): navigate
with the matching mode (`'day'`, `'three-days'`) so that Next moves by what the user sees.
