# Time grid

The Day, 3 days and Week views: the events of each day on a vertical time axis, with an all-day row,
the current time, drag, resize and context menus. `<mer-time-grid>` in Angular,
`MeridianaTimeGrid` in React and React Native. Drag an event below, or pull one of its edges.

<!-- preview drag-resize -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-time-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [dayStart]="{ hour: 7, minute: 0 }"
  [dayEnd]="{ hour: 18, minute: 0 }"
  [segmentHeight]="24"
  [responsive]="true"
  [draggable]="true"
  [resizable]="true"
  [snapMinutes]="15"
  [validateChange]="openingHours"
  (eventChange)="save($event)"
/>
```

```tsx [React]
// React
<MeridianaTimeGrid
  events={events}
  viewDate={viewDate}
  days={7}
  dayStart={{ hour: 7, minute: 0 }}
  dayEnd={{ hour: 18, minute: 0 }}
  segmentHeight={24}
  responsive
  draggable
  resizable
  snapMinutes={15}
  validateChange={(change) => change.start.getHours() >= 8}
  onEventChange={(change) => api.save(change.event.id, change.start, change.end)}
/>
```

<!-- /tabs -->

<!-- /preview -->

## Installation

<!-- install -->

```sh [Angular]
# Angular
npm install @moobitech/meridiana \
  @moobitech/meridiana-core \
  @moobitech/meridiana-angular \
  @angular/cdk date-fns
```

```sh [React]
# React
npm install @moobitech/meridiana \
  @moobitech/meridiana-core \
  @moobitech/meridiana-react \
  date-fns
```

```sh [React Native]
# React Native
npm install @moobitech/meridiana \
  @moobitech/meridiana-core \
  @moobitech/meridiana-react \
  @moobitech/meridiana-native \
  date-fns
npx expo install \
  react-native-gesture-handler \
  expo-application
```

<!-- /install -->

Then import the Tailwind entry and set the provider: see [Installation](getting-started.md).

## Usage

<!-- tabs -->

```ts [Angular]
// Angular
import { MeridianaTimeGridComponent } from '@moobitech/meridiana-angular';

@Component({
  imports: [MeridianaTimeGridComponent],
  template: `<mer-time-grid [events]="events()" [viewDate]="viewDate()" [days]="7" />`,
})
```

```tsx [React]
// React
import { MeridianaTimeGrid } from '@moobitech/meridiana-react';

<MeridianaTimeGrid events={events} viewDate={viewDate} days={7} />;
```

```tsx [React Native]
// React Native
import { MeridianaTimeGrid } from '@moobitech/meridiana-native';

<MeridianaTimeGrid events={events} viewDate={viewDate} days={3} responsive />;
```

<!-- /tabs -->

`days` is 1 (Day), 3 (3 days) or 7 (the week of `viewDate`). The view shows the events you pass for
the days it covers: load them with `getViewPeriod` (see
[Events and interactions](events-and-interactions.md#navigation)). On React Native give the calendar
a parent with a height (`flex: 1`): the grid scrolls inside it.

## Examples

### Week

<!-- preview week -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-time-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [days]="7"
  [dayStart]="{ hour: 8, minute: 0 }"
  [dayEnd]="{ hour: 18, minute: 0 }"
  [segmentHeight]="24"
  [responsive]="true"
/>
```

```tsx [React]
// React
<MeridianaTimeGrid
  events={events}
  viewDate={new Date()}
  days={7}
  dayStart={{ hour: 8, minute: 0 }}
  dayEnd={{ hour: 18, minute: 0 }}
  segmentHeight={24}
  responsive
/>
```

<!-- /tabs -->

<!-- /preview -->

### Day

<!-- preview day -->

```tsx
<MeridianaTimeGrid events={events} viewDate={viewDate} days={1} />
```

<!-- /preview -->

### 3 days

<!-- preview three-days -->

```tsx
<MeridianaTimeGrid events={events} viewDate={viewDate} days={3} />
```

<!-- /preview -->

### Work week

`excludeDays` skips weekdays (`0` = Sunday). In a week the excluded days are removed, so the week
shows fewer columns; with `fillExcludedDays` it keeps seven columns by borrowing the next days.

<!-- preview work-week -->

```tsx
<MeridianaTimeGrid events={events} viewDate={viewDate} days={7} excludeDays={[0, 6]} />
```

<!-- /preview -->

### Responsive days

With `responsive`, the grid shows one day up to 576px and three up to 768px, whatever `days` asks.
It reports the days it really shows (`onVisibleDaysChange` / `visibleDaysChange`), also at startup:
navigate with the matching mode (`'day'`, `'three-days'`) so that Next moves by what the user sees.
Resize the window on this page to see the examples above change.

### Drag and resize

`draggable` and `resizable` let the user move an event and change its start or end. Meridiana snaps
the times, shows a preview, and on release reports an `EventChange`: it never changes your events.
`validateChange` refuses a change (here, anything before 8:00). The details, the keyboard and touch
are in [Events and interactions](events-and-interactions.md#move-and-resize).

Try it in the example at the top of this page: drag an event, or one of its edges; a change that
starts before 8:00 is refused.

### Context menus

`eventMenu` and `slotMenu` return the entries of the menu of an event and of an empty slot; an empty
list means no menu. `showEventMenuButton` adds a "⋯" button to the events with a menu. Right click,
long press with a finger, the Menu key or Shift+F10 open it too: see
[Context menus](events-and-interactions.md#context-menus).

<!-- preview context-menu -->

```tsx
const eventMenu = useCallback(
  (event: CalendarEvent): CalendarMenuItem[] => [
    { label: 'Open', action: () => open(event) },
    { label: 'Duplicate', disabled: true, action: () => {} },
    { label: 'Delete', danger: true, action: () => remove(event) },
  ],
  [],
);

<MeridianaTimeGrid
  events={events}
  viewDate={viewDate}
  days={3}
  eventMenu={eventMenu}
  slotMenu={(date) => [{ label: 'New event here', action: () => create(date) }]}
  showEventMenuButton
/>;
```

<!-- /preview -->

### Custom event content

Draw the content of the event boxes yourself: `renderEvent` in React and React Native,
`eventTemplate` in Angular. The box, its color, its position and its states stay Meridiana's.
`compact` is true when the box is shorter than two lines, `narrow` when it only has room for the
title.

<!-- preview custom-event -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-time-grid [events]="events()" [viewDate]="viewDate()" [days]="3" [eventTemplate]="card" />

<ng-template #card let-event="event" let-timeLabel="timeLabel" let-compact="compact" let-narrow="narrow">
  <p class="truncate font-medium">{{ event.title }}</p>
  @if (!compact && !narrow) {
    <p class="truncate text-xs opacity-75">{{ timeLabel }} · {{ event.meta?.room }}</p>
  }
</ng-template>
```

```tsx [React]
// React
<MeridianaTimeGrid
  events={events}
  viewDate={viewDate}
  days={3}
  renderEvent={({ event, timeLabel, compact, narrow }) => (
    <>
      <p className="truncate font-medium">{event.title}</p>
      {!compact && !narrow && (
        <p className="truncate text-xs opacity-75">
          {timeLabel} · {event.meta?.room}
        </p>
      )}
    </>
  )}
/>
```

<!-- /tabs -->

<!-- /preview -->

### Overlapping events

With `overlap: 'cascade'` (the default), events that start within 30 minutes of each other sit side
by side; an event that starts later is drawn one step in, reaches the right edge and lies over the
earlier ones (`data-stacked`). Titles stay readable with many overlaps.

<!-- preview overlap-cascade -->

```tsx
<MeridianaTimeGrid events={events} viewDate={viewDate} days={1} />
```

<!-- /preview -->

`overlap: 'columns'` splits the column into equal parts instead.

<!-- preview overlap-columns -->

```tsx
<MeridianaTimeGrid events={events} viewDate={viewDate} days={1} overlap="columns" />
```

<!-- /preview -->

A box narrower than 72px is _narrow_ (`data-narrow`): it shows the title only and no "⋯" button; the
full text is in its tooltip (web).

### Everything together

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-time-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [days]="7"
  [responsive]="true"
  [dayStart]="{ hour: 8, minute: 0 }"
  [dayEnd]="{ hour: 20, minute: 0 }"
  [segmentsPerHour]="2"
  [draggable]="true"
  [resizable]="true"
  [validateChange]="sameDay"
  [eventMenu]="eventMenu"
  [slotMenu]="slotMenu"
  [showEventMenuButton]="true"
  [eventTemplate]="card"
  (eventClick)="open($event)"
  (slotClick)="create($event)"
  (eventChange)="save($event)"
  (visibleDaysChange)="visibleDays.set($event)"
/>

<ng-template #card let-event="event" let-timeLabel="timeLabel" let-compact="compact" let-narrow="narrow">
  <p class="font-medium">{{ event.title }}</p>
  @if (!compact && !narrow) {
    <p class="text-xs opacity-70">{{ timeLabel }}</p>
  }
</ng-template>
```

```tsx [React]
// React
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

<!-- /tabs -->

## API Reference

Angular inputs and React props have the same names. In Angular pass functions (`isEventDisabled`,
`eventMenu`, …) as class fields with arrow functions; in React pass stable functions
(`useCallback`): see [Angular](angular.md) and [React](react.md).

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `CalendarEvent<T>[]` | `[]` | The events to draw. See [Event model](api/event-model.md). |
| `viewDate` | `Date` | required | A day of the period to show. |
| `days` | `number` | `7` | 1, 3 or 7 (the week of `viewDate`). |
| `weekStartsOn` | `WeekDay` (`0` … `6`) | provider | First day of the week. |
| `excludeDays` | `WeekDay[]` | `[]` | Weekdays to skip. |
| `fillExcludedDays` | `boolean` | `false` | Week: keep seven columns by borrowing the next days. |
| `startsWithToday` | `boolean` | `false` | Week: start from `viewDate`, not from the start of its week. |
| `dayStart`, `dayEnd` | `Time` (`{ hour, minute }`) | `00:00`, `24:00` | First visible time, last visible time (excluded). |
| `segmentsPerHour` | `1 \| 2 \| 3 \| 4 \| 6 \| 12` | `2` | Rows per hour. |
| `segmentHeight` | `number` | `40` | Pixels per segment. |
| `eventGap` | `number` | `4` | Pixels between touching events. |
| `overlap` | `'cascade' \| 'columns'` | `'cascade'` | How overlapping events are laid out. |
| `locale` | `string` | provider | BCP 47 locale of dates and times. |
| `responsive` | `boolean` | `false` | Fewer days on narrow screens: one up to 576px, three up to 768px. |
| `maxHeight` | `string` | — | CSS max-height of the scrolling grid, e.g. `70vh`. Web only. |
| `showSlotTime` | `boolean` | `false` | Write the time in every slot. Web only. |
| `theme` | `Partial<MeridianaTheme>` | provider | Slots that replace the provider theme. See [Theming](theming.md). |
| `isSlotDisabled` | `(date: Date) => boolean` | never | A disabled slot ignores clicks and has no menu. |
| `isEventDisabled` | `(event: CalendarEvent<T>) => boolean` | never | A disabled event ignores clicks, drag and resize, looks dimmed, and keeps its menu. |
| `eventMenu` | `(event: CalendarEvent<T>) => CalendarMenuItem[]` | no menu | Menu of an event; an empty list means no menu. |
| `slotMenu` | `(date: Date) => CalendarMenuItem[]` | no menu | Menu of an empty slot. |
| `showEventMenuButton` | `boolean` | `false` | The "⋯" button on the events with a menu. |
| `eventMenuButtonLabel` | `string` | `'Actions'` | Accessible name of the "⋯" button. |
| `draggable` | `boolean` | `false` | Move events with the pointer, a finger or the keyboard. |
| `resizable` | `boolean` | `false` | Change the start or end of events. |
| `snapMinutes` | `number` | one segment | Step of moves and resizes, in minutes. |
| `validateChange` | `(change: EventChange<T>) => boolean` | always valid | `false` shows the preview as invalid and drops nothing. |
| `eventTemplate` (Angular) | `TemplateRef<TimeGridEventContext<T>>` | — | Content of an event box. |
| `renderEvent` (React) | `(context: TimeGridEventContext<T>) => ReactNode` | — | Content of an event box. |
| `menuItemTemplate` (Angular) | `TemplateRef<MenuItemContext>` | — | A menu entry; `$implicit` is the `CalendarMenuItem`. |
| `renderMenuItem` (React) | `(item: CalendarMenuItem) => ReactNode` | — | A menu entry. |

### Events

| Angular output | React callback | Payload | When |
| --- | --- | --- | --- |
| `eventClick` | `onEventClick` | `CalendarEvent<T>` | An event is clicked or tapped (not when disabled). |
| `slotClick` | `onSlotClick` | `Date` | An empty slot; the date is its start. |
| `dayHeaderClick` | `onDayHeaderClick` | `Date` | A day header. |
| `eventChange` | `onEventChange` | `EventChange<T>` | A move or resize is dropped. |
| `visibleDaysChange` | `onVisibleDaysChange` | `number` | The days actually shown change, also at startup. |

### Event content context

What `eventTemplate` (Angular, as `let-` variables) and `renderEvent` (React, one object) receive:

| Field | Type | Description |
| --- | --- | --- |
| `$implicit` (Angular) / `placed` (React) | the placed event | Position, size and flags of the box. |
| `event` | `CalendarEvent<T>` | The event. |
| `timeLabel` | `string` | `09:00 – 10:30`, in the calendar locale. |
| `compact` | `boolean` | The box is shorter than two lines: show the title only. |
| `roomy` | `boolean` | The box has room for the description. |
| `narrow` | `boolean` | Title only: no time, no "⋯" button. |
| `disabled` | `boolean` | `isEventDisabled` returned true. |

### React Native

`MeridianaTimeGrid` of `@moobitech/meridiana-native` takes the React props, with these differences
(see [React Native](react-native.md)):

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `longPressMs` | `number` | `350` | Long press that selects an event or opens a menu. |
| `maxHeight`, `showSlotTime` | | | Not available: the grid takes the height of its parent. |
| `theme` | `Partial<MeridianaNativeTheme>` | provider | Native slots. |
| `renderEvent`, `renderMenuItem` | | | Return React Native elements. |
