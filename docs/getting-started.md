# Installation

Install Meridiana, point Tailwind to its classes, set the provider and draw your first calendar:
the week below, with one yoga class.

<!-- preview first-calendar -->

```tsx
import { CalendarEvent } from '@moobitech/meridiana-core';
import { MeridianaTimeGrid } from '@moobitech/meridiana-react';

const events: CalendarEvent<{ room: string }>[] = [
  {
    id: 1,
    title: 'Yoga',
    start: new Date(2026, 9, 12, 9, 0),
    end: new Date(2026, 9, 12, 10, 0),
    color: { primary: '#059669', secondary: '#d1fae5' },
    meta: { room: 'Studio A' },
  },
];

<MeridianaTimeGrid
  events={events}
  viewDate={new Date(2026, 9, 12)}
  days={7}
  dayStart={{ hour: 8, minute: 0 }}
  dayEnd={{ hour: 12, minute: 0 }}
  segmentHeight={24}
  responsive
  onEventClick={(event) => console.log(event.meta?.room)}
/>;
```

<!-- /preview -->

## 1. Install

Every renderer needs the core, the Tailwind entry `@moobitech/meridiana` and `date-fns` version 4.
Pick the renderer of your platform:

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

| Package | Peer dependencies |
| --- | --- |
| `@moobitech/meridiana` | `@moobitech/meridiana-core` and, when installed, the renderers |
| `@moobitech/meridiana-core` | `date-fns` ^4 |
| `@moobitech/meridiana-angular` | `@angular/core`, `@angular/common`, `@angular/cdk` ^22 |
| `@moobitech/meridiana-react` | `react`, `react-dom` ^19 |
| `@moobitech/meridiana-native` | `react` ^19, `react-native` 0.88+, `react-native-gesture-handler` ^3 (Expo SDK 58+), `expo-application` (the bundle id, for the license key), `@moobitech/meridiana-react` |

## 2. Tailwind CSS

Meridiana ships Tailwind classes, not a stylesheet: your Tailwind build generates them. The classes
live in the JavaScript of the packages, in `node_modules`, and Tailwind v4 skips `node_modules`:
without the step below some classes are never generated. There is no error, only elements out of
place, and it is easy to miss, because your app may already use most of the same classes.

Import `@moobitech/meridiana` next to Tailwind, as you import `tailwindcss`. It points Tailwind to
the packages you installed, with paths relative to itself, so it works with npm, yarn and pnpm and
from any folder. Import it with any theme, your own too: the components carry layout classes of
their own that no theme replaces. It also brings the color tokens of the default web theme
(`--mer-*`); a theme of your own ignores them.

<!-- tabs -->

```css [Web]
/* Web */
/* Tailwind v4 entry (Angular, React) */
@import 'tailwindcss';
@import '@moobitech/meridiana';

/* Optional: dark mode with the .dark class */
@custom-variant dark (&:where(.dark, .dark *));
```

```css [React Native]
/* React Native */
/* CSS entry of Uniwind */
@import 'tailwindcss';
@import 'uniwind';
@import '@moobitech/meridiana';
```

<!-- /tabs -->

- **Web (Angular, React)**: if a tool in your CSS pipeline does not resolve the `style` condition of
  package exports (a bundler or a `postcss-import` setup outside Tailwind v4), import the file by
  its path instead; it is the same file: `@import '@moobitech/meridiana/tailwind.css';`.
- **React Native**: Meridiana uses [Uniwind](https://uniwind.dev). Import the same package in the
  CSS entry of Uniwind; the default native theme uses the color tokens of gluestack-ui (see
  [React Native](react-native.md)).

## 3. Provider

Set the locale, the first day of the week, the license key and the theme once.

<!-- tabs -->

```ts [Angular]
// Angular
// app.config.ts
import { provideMeridiana } from '@moobitech/meridiana-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideMeridiana({ locale: 'en-GB', weekStartsOn: 1, licenseKey: '…' })],
};
```

```tsx [React]
// React
import { MeridianaProvider } from '@moobitech/meridiana-react';

<MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey="…">
  <App />
</MeridianaProvider>;
```

```tsx [React Native]
// React Native
import { MeridianaProvider } from '@moobitech/meridiana-native';

<MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey="…">
  <App />
</MeridianaProvider>;
```

<!-- /tabs -->

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `locale` | `string` | the device locale | Any BCP 47 tag, e.g. `it-IT`. Dates and times are formatted with `Intl`. |
| `weekStartsOn` | `0` … `6` | `1` (Monday) | `0` = Sunday … `6` = Saturday. |
| `licenseKey` | `string` | — | See "License key" below. |
| `theme` | `Partial<MeridianaTheme>` | the default theme | Slots that replace the default classes. See [Theming](theming.md). |

Every view also takes `locale`, `weekStartsOn` and `theme` as inputs, which win over the provider.

## 4. Your first calendar

<!-- tabs -->

```ts [Angular]
// Angular
import { Component, signal } from '@angular/core';
import { CalendarEvent } from '@moobitech/meridiana-core';
import { MeridianaTimeGridComponent } from '@moobitech/meridiana-angular';

type Room = { room: string };

@Component({
  selector: 'app-planner',
  imports: [MeridianaTimeGridComponent],
  template: `
    <mer-time-grid
      [events]="events()"
      [viewDate]="viewDate()"
      [days]="7"
      [dayStart]="{ hour: 8, minute: 0 }"
      [dayEnd]="{ hour: 12, minute: 0 }"
      [segmentHeight]="24"
      [responsive]="true"
      (eventClick)="open($event)"
    />
  `,
})
export class Planner {
  readonly viewDate = signal(new Date(2026, 9, 12));
  readonly events = signal<CalendarEvent<Room>[]>([
    {
      id: 1,
      title: 'Yoga',
      start: new Date(2026, 9, 12, 9, 0),
      end: new Date(2026, 9, 12, 10, 0),
      color: { primary: '#059669', secondary: '#d1fae5' },
      meta: { room: 'Studio A' },
    },
  ]);

  open(event: CalendarEvent<Room>) {
    console.log(event.meta?.room);
  }
}
```

```tsx [React]
// React
import { CalendarEvent } from '@moobitech/meridiana-core';
import { MeridianaTimeGrid } from '@moobitech/meridiana-react';

const events: CalendarEvent<{ room: string }>[] = [
  {
    id: 1,
    title: 'Yoga',
    start: new Date(2026, 9, 12, 9, 0),
    end: new Date(2026, 9, 12, 10, 0),
    color: { primary: '#059669', secondary: '#d1fae5' },
    meta: { room: 'Studio A' },
  },
];

<MeridianaTimeGrid
  events={events}
  viewDate={new Date(2026, 9, 12)}
  days={7}
  dayStart={{ hour: 8, minute: 0 }}
  dayEnd={{ hour: 12, minute: 0 }}
  segmentHeight={24}
  responsive
  onEventClick={(event) => console.log(event.meta?.room)}
/>;
```

<!-- /tabs -->

This is the calendar at the top of this page. The view shows the events you pass for the days it
covers. Load the events of the period the view
shows with `getViewPeriod` (see [Events and interactions](events-and-interactions.md#navigation)).
The views: [Time grid](time-grid.md) (Day, 3 days, Week), [Month](month.md) and [Agenda](agenda.md).

## 5. License key

Meridiana is commercial software. Without a key every view works and shows a small
"Meridiana · unlicensed" label, and the console shows one warning: you may evaluate it like this for
30 days in a non-production environment. With a purchase you receive a key: pass it to the provider
(`licenseKey`) or call `setLicenseKey()` from `@moobitech/meridiana-core` before the first calendar
renders.

The key is checked offline and stays valid forever for the versions released during your
subscription. Keep it out of public repositories: read it from your environment or build
configuration. See [Licensing](licensing.md) for the whole lifecycle and [`LICENSE.md`](../LICENSE.md)
for the terms.
