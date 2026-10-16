# Angular

`@moobitech/meridiana-angular` — standalone components with signals and `OnPush`, for Angular 22.
The context menus use `@angular/cdk/menu`.

```ts
import { provideMeridiana } from '@moobitech/meridiana-angular';

bootstrapApplication(App, {
  providers: [provideMeridiana({ locale: 'en-GB', weekStartsOn: 1, licenseKey: '…', theme: {} })],
});
```

```ts
import {
  MeridianaAgendaComponent,
  MeridianaMonthGridComponent,
  MeridianaTimeGridComponent,
} from '@moobitech/meridiana-angular';

@Component({
  imports: [MeridianaTimeGridComponent, MeridianaMonthGridComponent, MeridianaAgendaComponent],
  // …
})
```

Pass functions (`isEventDisabled`, `eventMenu`, …) as class fields with arrow functions, so that
`this` is your component and the inputs do not change on every change detection.

## `<mer-time-grid>` — Day, 3 days, Week

```html
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

### Inputs

| Input | Default | Notes |
| --- | --- | --- |
| `events` | `[]` | `CalendarEvent<T>[]` |
| `viewDate` | required | |
| `days` | `7` | 1, 3 or 7 (the week of `viewDate`) |
| `weekStartsOn` | provider | |
| `excludeDays` | `[]` | weekdays to skip |
| `fillExcludedDays` | `false` | week: keep seven columns by borrowing the next days |
| `startsWithToday` | `false` | week: start from `viewDate` |
| `dayStart`, `dayEnd` | `00:00`, `24:00` | `{ hour, minute }` |
| `segmentsPerHour` | `2` | 1, 2, 3, 4, 6 or 12 |
| `segmentHeight` | `40` | pixels per segment |
| `eventGap` | `4` | pixels between touching events |
| `overlap` | `'cascade'` | or `'columns'` |
| `locale` | provider | |
| `responsive` | `false` | fewer days on narrow screens |
| `maxHeight` | — | CSS max-height of the scrolling grid, e.g. `70vh` |
| `showSlotTime` | `false` | write the time in every slot |
| `theme` | provider | slots that replace the provider theme |
| `isSlotDisabled`, `isEventDisabled` | never | |
| `eventMenu`, `slotMenu` | no menu | functions returning `CalendarMenuItem[]` |
| `showEventMenuButton` | `false` | the "⋯" button on events with a menu |
| `eventMenuButtonLabel` | `'Actions'` | accessible name of the button |
| `eventTemplate` | — | `TemplateRef<TimeGridEventContext<T>>` |
| `menuItemTemplate` | — | `TemplateRef<MenuItemContext>` (`$implicit`: the item) |
| `draggable`, `resizable` | `false` | |
| `snapMinutes` | one segment | |
| `validateChange` | always valid | `(change) => boolean` |

`TimeGridEventContext`: `$implicit` (the placed event), `event`, `timeLabel`, `compact` (shorter than
two lines), `roomy` (room for the description), `narrow` (title only), `disabled`.

### Outputs

`eventClick`, `slotClick`, `dayHeaderClick`, `eventChange` (`EventChange<T>`), `visibleDaysChange`
(days actually shown, also at startup).

## `<mer-month-grid>` — Month

```html
<mer-month-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [maxEventsPerDay]="3"
  [moreLabel]="moreLabel"
  [dayMenu]="dayMenu"
  [eventMenu]="eventMenu"
  (eventClick)="open($event)"
  (dayClick)="openDay($event)"
/>
```

| Input | Default | Notes |
| --- | --- | --- |
| `events`, `viewDate`, `weekStartsOn`, `excludeDays`, `locale`, `theme` | | as above |
| `fixedWeeks` | `false` | always six weeks |
| `maxEventsPerDay` | `3` | rows before "+N" |
| `responsive` | `true` | colored dots under 640px |
| `isEventDisabled`, `eventMenu`, `dayMenu` | | |
| `eventTemplate` | — | `TemplateRef<MonthEventContext<T>>`: `$implicit` (the event), `timeLabel`, `disabled` |
| `menuItemTemplate` | — | |
| `moreLabel` | `` n => `+${n} more` `` | |

Outputs: `eventClick`, `dayClick`.

## `<mer-agenda>` — Agenda

```html
<mer-agenda
  [events]="events()"
  [viewDate]="viewDate()"
  [days]="7"
  emptyLabel="Nothing planned"
  allDayLabel="All day"
  [eventTemplate]="row"
  (eventClick)="open($event)"
  (dayClick)="openDay($event)"
/>
```

| Input | Default | Notes |
| --- | --- | --- |
| `events`, `viewDate`, `excludeDays`, `locale`, `theme` | | as above |
| `days` | `7` | days from `viewDate` |
| `showEmptyDays` | `false` | keep the days without events |
| `isEventDisabled`, `eventMenu`, `menuItemTemplate` | | |
| `eventTemplate` | — | the row content after time and dot: `$implicit` (the event), `item`, `timeLabel`, `disabled` |
| `emptyLabel`, `allDayLabel` | `'No events'`, `'All day'` | |

Outputs: `eventClick`, `dayClick`.

## Helpers

- `eventColorStyle(event)`: the CSS variables of an event's color, for your own templates.
- `MeridianaContextMenuComponent`: the menu used by the views, if you open one yourself with
  `cdkContextMenuTriggerFor`.
