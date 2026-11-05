# Agenda

The Agenda view: a list of the events of `days` days from `viewDate`, grouped by day, with their
times, all-day events and the events that go on over several days. `<mer-agenda>` in Angular,
`MeridianaAgenda` in React and React Native.

<!-- preview agenda-empty-days -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-agenda
  [events]="events()"
  [viewDate]="viewDate()"
  [days]="7"
  [showEmptyDays]="true"
  emptyLabel="Nothing planned"
  allDayLabel="All day"
  (eventClick)="open($event)"
  (dayClick)="openDay($event)"
/>
```

```tsx [React]
// React
<MeridianaAgenda
  events={events}
  viewDate={viewDate}
  days={7}
  showEmptyDays
  emptyLabel="Nothing planned"
  allDayLabel="All day"
  onEventClick={open}
  onDayClick={openDay}
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
import { MeridianaAgendaComponent } from '@moobitech/meridiana-angular';

@Component({
  imports: [MeridianaAgendaComponent],
  template: `<mer-agenda [events]="events()" [viewDate]="viewDate()" [days]="7" />`,
})
```

```tsx [React]
// React
import { MeridianaAgenda } from '@moobitech/meridiana-react';

<MeridianaAgenda events={events} viewDate={viewDate} days={7} />;
```

```tsx [React Native]
// React Native
import { MeridianaAgenda } from '@moobitech/meridiana-native';

<MeridianaAgenda events={events} viewDate={viewDate} days={7} />;
```

<!-- /tabs -->

The `days` of the view default to 7. The navigation helpers of the core cover `agendaDays` days,
30 unless you set it: pass the same number to both (see
[Events and interactions](events-and-interactions.md#navigation)). On React Native the list scrolls
inside its parent: give it a height (`flex: 1`).

## Examples

### Basic

Three days, the days without events left out, the room of each event on the right.

<!-- preview agenda -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-agenda [events]="events()" [viewDate]="viewDate()" [days]="3" [eventTemplate]="row" />

<ng-template #row let-event>
  <span class="flex min-w-0 flex-1 items-center justify-between gap-2">
    <span class="truncate">{{ event.title }}</span>
    <span class="shrink-0 text-xs">{{ event.meta?.room }}</span>
  </span>
</ng-template>
```

```tsx [React]
// React
<MeridianaAgenda
  events={events}
  viewDate={new Date()}
  days={3}
  renderEvent={(row) => (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
      <span className="truncate">{row.event.title}</span>
      <span className="shrink-0 text-xs">{row.event.meta?.room}</span>
    </span>
  )}
/>
```

<!-- /tabs -->

<!-- /preview -->

### Empty days and labels

By default the days without events are left out; `showEmptyDays` keeps them. `emptyLabel` is the
message of a period without events, `allDayLabel` the time label of the all-day events.

Try it in the example at the top of this page: a week with its empty days.

## API Reference

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `CalendarEvent<T>[]` | `[]` | The events to list. |
| `viewDate` | `Date` | required | The first day of the list. |
| `days` | `number` | `7` | Days from `viewDate`. |
| `excludeDays` | `WeekDay[]` | `[]` | Weekdays to skip. |
| `showEmptyDays` | `boolean` | `false` | Keep the days without events. |
| `locale` | `string` | provider | BCP 47 locale of dates and times. |
| `theme` | `Partial<MeridianaTheme>` | provider | Slots that replace the provider theme. |
| `isEventDisabled` | `(event: CalendarEvent<T>) => boolean` | never | A disabled event ignores clicks and keeps its menu. |
| `eventMenu` | `(event: CalendarEvent<T>) => CalendarMenuItem[]` | no menu | Menu of an event. |
| `emptyLabel` | `string` | `'No events'` | The message of a period without events. |
| `allDayLabel` | `string` | `'All day'` | The time label of the all-day events. |
| `eventTemplate` (Angular) | `TemplateRef<AgendaEventContext<T>>` | — | The row content after time and dot: `$implicit` (the event), `item`, `timeLabel`, `disabled`. |
| `renderEvent` (React) | `(row: AgendaRow<T>) => ReactNode` | — | The same: `{ event, item, timeLabel, disabled, … }`. |
| `menuItemTemplate` (Angular) | `TemplateRef<MenuItemContext>` | — | A menu entry. |
| `renderMenuItem` (React) | `(item: CalendarMenuItem) => ReactNode` | — | A menu entry. |

### Events

| Angular output | React callback | Payload | When |
| --- | --- | --- | --- |
| `eventClick` | `onEventClick` | `CalendarEvent<T>` | An event is clicked or tapped (not when disabled). |
| `dayClick` | `onDayClick` | `Date` | A day header. |

### React Native

`MeridianaAgenda` of `@moobitech/meridiana-native` takes the same props. `theme` takes a
`Partial<MeridianaNativeTheme>`; `renderEvent` and `renderMenuItem` return React Native elements.
See [React Native](react-native.md).
