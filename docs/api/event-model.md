# Event model

The types the views take and report, from `@moobitech/meridiana-core`. Events are generic: your own
data travels in `meta`, typed end to end, and Meridiana never reads it.

## CalendarEvent

Every view takes an array of `CalendarEvent<TMeta>`:

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

```ts
import { CalendarEvent } from '@moobitech/meridiana-core';

const yoga: CalendarEvent<{ room: string }> = {
  id: 1,
  title: 'Yoga',
  start: new Date(2026, 9, 12, 9, 0),
  end: new Date(2026, 9, 12, 10, 0),
  color: { primary: '#059669', secondary: '#d1fae5' },
  meta: { room: 'Studio A' },
};
```

## CalendarEventColor

| Field | Type | Description |
| --- | --- | --- |
| `primary` | `string` | The bar and the dot. On the web it arrives on the event as `--mer-event-border` and `--mer-event-color`. |
| `secondary` | `string?` | The background (`--mer-event-bg`). |
| `text` | `string?` | The text (`--mer-event-text`). |

The default theme reads these variables first and falls back to `--mer-default-event-*`: see
[Theming](../theming.md).

## CalendarMenuItem

The entries of the menus of `eventMenu`, `slotMenu` and `dayMenu`; an empty list means no menu.

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | The text of the entry. |
| `icon` | `string?` | A free value for your item template, e.g. an icon name. |
| `disabled` | `boolean?` | Shown, not selectable. |
| `danger` | `boolean?` | A destructive action, drawn with the danger color of the theme. |
| `action` | `() => void` | Runs when the entry is chosen. |

## EventChange

What `onEventChange` / `eventChange` report when the user drops a move or a resize. Meridiana does
not change your events: save the change and update `events`, or ignore it.

| Field | Type | Description |
| --- | --- | --- |
| `event` | `CalendarEvent<T>` | The event as it was. |
| `kind` | `'move' \| 'resize-start' \| 'resize-end'` | What changed. |
| `start` | `Date` | The new start. |
| `end` | `Date` | The new end. |

## Smaller types

| Type | Definition | Description |
| --- | --- | --- |
| `WeekDay` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | As `Date.getDay()` returns it: `0` = Sunday … `6` = Saturday. |
| `Time` | `{ hour: number; minute: number }` | A wall-clock time; `{ hour: 24, minute: 0 }` is the end of the day. |
| `DateRange` | `{ start: Date; end: Date }` | Half open: `start` included, `end` excluded. |
| `CalendarEventStatus` | `'ok' \| 'warning' \| 'danger'` | The status dot of an event. |
| `CalendarViewMode` | `'agenda' \| 'day' \| 'three-days' \| 'week' \| 'month'` | The five views, for the navigation helpers. |
| `NavigationDirection` | `'previous' \| 'next' \| 'today'` | The direction of `navigate`. |

Defaults the core uses: an event without an end lasts 30 minutes in the time grid
(`DEFAULT_EVENT_MINUTES`), weeks start on Monday (`DEFAULT_WEEK_STARTS_ON` = `1`), the weekend is
Saturday and Sunday (`DEFAULT_WEEKEND_DAYS` = `[0, 6]`).
