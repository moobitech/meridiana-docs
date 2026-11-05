# Month

The Month view: whole weeks that cover the month of `viewDate`, the first events of each day with a
"+N" for the others, multi-day events as bars, and colored dots on phones. `<mer-month-grid>` in
Angular, `MeridianaMonthGrid` in React and React Native. Click a day or its "+N" below, or right click a day.

<!-- preview month-menu -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-month-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [maxEventsPerDay]="2"
  [moreLabel]="moreLabel"
  [dayMenu]="dayMenu"
  [eventMenu]="eventMenu"
  (eventClick)="open($event)"
  (dayClick)="openDay($event)"
/>
```

```tsx [React]
// React
<MeridianaMonthGrid
  events={events}
  viewDate={viewDate}
  maxEventsPerDay={2}
  moreLabel={(n) => `+${n} more`}
  dayMenu={dayMenu}
  eventMenu={eventMenu}
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
import { MeridianaMonthGridComponent } from '@moobitech/meridiana-angular';

@Component({
  imports: [MeridianaMonthGridComponent],
  template: `<mer-month-grid [events]="events()" [viewDate]="viewDate()" />`,
})
```

```tsx [React]
// React
import { MeridianaMonthGrid } from '@moobitech/meridiana-react';

<MeridianaMonthGrid events={events} viewDate={viewDate} />;
```

```tsx [React Native]
// React Native
import { MeridianaMonthGrid } from '@moobitech/meridiana-native';

<MeridianaMonthGrid events={events} viewDate={viewDate} />;
```

<!-- /tabs -->

Load the events of the whole grid, which starts and ends with days of the next and previous months:
`getViewPeriod('month', viewDate, options)` gives the range (see
[Events and interactions](events-and-interactions.md#navigation)).

## Examples

### Basic

Three rows a day before the "+N", no menus.

<!-- preview month -->

<!-- tabs -->

```html [Angular]
<!-- Angular -->
<mer-month-grid [events]="events()" [viewDate]="viewDate()" [maxEventsPerDay]="3" />
```

```tsx [React]
// React
<MeridianaMonthGrid events={events} viewDate={new Date()} maxEventsPerDay={3} />
```

<!-- /tabs -->

<!-- /preview -->

### Menus and "+N"

`maxEventsPerDay` sets the rows of a cell before the "+N" link; `moreLabel` writes its text.
`dayMenu` and `eventMenu` give the menus of a day cell and of an event (right click, long press with
a finger). A click on the day number, the "+N" link or a compact cell reports `dayClick` /
`onDayClick`: open that day in the time grid.

Try it in the example at the top of this page; its code is in the Code tab there.

### Phones: dots

With `responsive` (the default) the cells show colored dots under 640px, as in the example above on
a phone. `dotTemplate` (Angular) or `renderDot` (React, React Native) draws the mark of an event
there instead of the dot, for example an icon for a state. On a phone the React Native month shows
dots.

## API Reference

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `CalendarEvent<T>[]` | `[]` | The events to draw. |
| `viewDate` | `Date` | required | A day of the month to show. |
| `weekStartsOn` | `WeekDay` (`0` … `6`) | provider | First day of the week. |
| `excludeDays` | `WeekDay[]` | `[]` | Weekdays to skip. |
| `fixedWeeks` | `boolean` | `false` | Always six weeks, so the height does not change between months. |
| `locale` | `string` | provider | BCP 47 locale of dates and times. |
| `maxEventsPerDay` | `number` | `3` | Rows before "+N". |
| `responsive` | `boolean` | `true` | Colored dots under 640px. |
| `theme` | `Partial<MeridianaTheme>` | provider | Slots that replace the provider theme. |
| `isEventDisabled` | `(event: CalendarEvent<T>) => boolean` | never | A disabled event ignores clicks and keeps its menu. |
| `eventMenu` | `(event: CalendarEvent<T>) => CalendarMenuItem[]` | no menu | Menu of an event. |
| `dayMenu` | `(date: Date) => CalendarMenuItem[]` | no menu | Menu of a day cell. |
| `moreLabel` | `(count: number) => string` | `` n => `+${n} more` `` | Text of the "+N" link. |
| `eventTemplate` (Angular) | `TemplateRef<MonthEventContext<T>>` | — | An event row: `$implicit` (the event), `timeLabel`, `disabled`. |
| `renderEvent` (React) | `(row: MonthEventRow<T>) => ReactNode` | — | An event row: `{ event, timeLabel, disabled, … }`. |
| `dotTemplate` (Angular) | `TemplateRef<MonthEventContext<T>>` | — | The mark of an event in a compact cell instead of the colored dot; same context as `eventTemplate`. |
| `renderDot` (React) | `(row: MonthEventRow<T>) => ReactNode` | — | The same, in React and React Native. |
| `menuItemTemplate` (Angular) | `TemplateRef<MenuItemContext>` | — | A menu entry. |
| `renderMenuItem` (React) | `(item: CalendarMenuItem) => ReactNode` | — | A menu entry. |

### Events

| Angular output | React callback | Payload | When |
| --- | --- | --- | --- |
| `eventClick` | `onEventClick` | `CalendarEvent<T>` | An event is clicked or tapped (not when disabled). |
| `dayClick` | `onDayClick` | `Date` | The day number, the "+N" link or a compact cell. |

### React Native

`MeridianaMonthGrid` of `@moobitech/meridiana-native` takes the same props. `theme` takes a
`Partial<MeridianaNativeTheme>`; `renderEvent`, `renderDot` and `renderMenuItem` return React Native
elements. See [React Native](react-native.md).
