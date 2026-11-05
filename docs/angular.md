# Angular

`@moobitech/meridiana-angular`: standalone components with signals and `OnPush`, for Angular 22. The
context menus use `@angular/cdk/menu`.

<!-- preview week -->

```html
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

<!-- /preview -->

## Installation

<!-- install -->

```sh
npm install @moobitech/meridiana \
  @moobitech/meridiana-core \
  @moobitech/meridiana-angular \
  @angular/cdk date-fns
```

<!-- /install -->

Import the Tailwind entry next to Tailwind (see [Installation](getting-started.md#2-tailwind-css)),
then set the provider:

```ts
import { provideMeridiana } from '@moobitech/meridiana-angular';

bootstrapApplication(App, {
  providers: [provideMeridiana({ locale: 'en-GB', weekStartsOn: 1, licenseKey: '…', theme: {} })],
});
```

## Usage

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

| Component | Views | Inputs, outputs and templates |
| --- | --- | --- |
| `<mer-time-grid>` | Day, 3 days, Week | [Time grid](time-grid.md#api-reference) |
| `<mer-month-grid>` | Month | [Month](month.md#api-reference) |
| `<mer-agenda>` | Agenda | [Agenda](agenda.md#api-reference) |

## Templates

Each view takes an `ng-template` for the content of its events and one for the entries of its
menus. Their contexts:

| Template input | View | Context |
| --- | --- | --- |
| `eventTemplate` | time grid | `TimeGridEventContext`: `$implicit` (the placed event), `event`, `timeLabel`, `compact` (shorter than two lines), `roomy` (room for the description), `narrow` (title only), `disabled` |
| `eventTemplate` | month | `MonthEventContext`: `$implicit` (the event), `timeLabel`, `disabled` |
| `dotTemplate` | month | the mark of an event in a compact cell instead of the colored dot; same context as `eventTemplate` |
| `eventTemplate` | agenda | `AgendaEventContext`, the row content after time and dot: `$implicit` (the event), `item`, `timeLabel`, `disabled` |
| `menuItemTemplate` | all | `MenuItemContext`: `$implicit` (the `CalendarMenuItem`) |

```html
<mer-time-grid [events]="events()" [viewDate]="viewDate()" [eventTemplate]="card" />

<ng-template #card let-event="event" let-timeLabel="timeLabel" let-compact="compact" let-narrow="narrow">
  <p class="font-medium">{{ event.title }}</p>
  @if (!compact && !narrow) {
    <p class="text-xs opacity-70">{{ timeLabel }}</p>
  }
</ng-template>
```

## Helpers

`eventColorStyle(event)` and `MeridianaContextMenuComponent`, for your own templates and menus: see
[Hooks and helpers](api/hooks-and-helpers.md#angular).
