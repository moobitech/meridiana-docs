# Meridiana

**Calendar and scheduler components for Angular, React and React Native, styled with Tailwind CSS.**

Meridiana draws the five views a booking, planning or scheduling product needs — **Agenda, Day,
3 days, Week and Month** — with the interactions users expect: drag to move, resize from the edges,
context menus, snapping to the grid, auto-scroll and validation. One engine computes layouts and
interactions; thin renderers draw them for each platform, so every app behaves the same way.

| Package | For | What you get |
| --- | --- | --- |
| [`@moobitech/meridiana-core`](core/README.md) | any TypeScript | The engine: view layouts, navigation, interaction state machine, theme. No UI. |
| [`@moobitech/meridiana-angular`](angular/README.md) | Angular 22 | `<mer-time-grid>`, `<mer-month-grid>`, `<mer-agenda>` |
| [`@moobitech/meridiana-react`](react/README.md) | React 19 (DOM) | `MeridianaTimeGrid`, `MeridianaMonthGrid`, `MeridianaAgenda`, and DOM-free hooks |
| [`@moobitech/meridiana-native`](native/README.md) | React Native / Expo | The same three views with Gesture Handler and Uniwind |

## Highlights

- **Five views**: Agenda, Day, 3 days, Week (with excluded days, optionally kept at seven columns)
  and Month (with "+N more" and colored dots on phones).
- **Responsive**: the week shows three days under 768px and one day under 576px.
- **Overlapping events in a cascade**: events that start together sit side by side, a later one is
  drawn one step in and over the earlier ones, so titles stay readable.
- **Move and resize** with snapping, a minimum length, auto-scroll near the edges and your own
  `validate` rule. Meridiana reports the change; your app saves it.
- **Context menus** on events, empty slots and month cells: right click, long press, the Menu key or
  a "⋯" button. On phones, a bottom sheet.
- **Tailwind themes**: every element takes its classes from a named slot, states arrive as `data-*`
  attributes (`data-today:`, `data-dragging:`, …). Restyle with CSS variables, a few slots or a
  whole design system.
- **Accessible**: grid, row and button roles, labels on every day and event, keyboard menus, move and resize with the keyboard (Space, arrows).
- **Locales** through `Intl`: dates, weekdays and times follow the locale you pass.
- **Typed**: events carry your own data in `meta`, typed end to end.
- **Light**: the only runtime peer is `date-fns` 4 (plus your framework). No moment, no CDK on React.

## Quick start

```sh
npm install @moobitech/meridiana-core @moobitech/meridiana-react date-fns
```

```tsx
import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-react';

export function Planner({ events, save }) {
  return (
    <MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey={process.env.MERIDIANA_KEY}>
      <MeridianaTimeGrid
        events={events}
        viewDate={new Date()}
        days={7}
        dayStart={{ hour: 8, minute: 0 }}
        dayEnd={{ hour: 20, minute: 0 }}
        responsive
        draggable
        resizable
        onEventChange={save}
      />
    </MeridianaProvider>
  );
}
```

```css
/* your Tailwind entry */
@import 'tailwindcss';
@import '@moobitech/meridiana-core/theme.css';
@source '../node_modules/@moobitech';
```

The same calendar in [Angular](docs/angular.md) and [React Native](docs/react-native.md).

## Documentation

1. [Getting started](docs/getting-started.md) — install, Tailwind, provider, license key
2. [Events and interactions](docs/events-and-interactions.md) — the event model, menus, move and
   resize, validation, navigation
3. [Theming](docs/theming.md) — CSS variables, slots, states, design systems, dark mode
4. [Angular](docs/angular.md) — components, inputs, outputs and templates
5. [React](docs/react.md) — components, props and render props
6. [React Native](docs/react-native.md) — setup with Expo, gestures, bottom sheet, gluestack-ui
7. [Core engine](docs/core.md) — the layout and interaction API, to build your own renderer
8. [Licensing](docs/licensing.md) — evaluation, license key, renewals, how the offline check works

## Demos

Every view and interaction runs in a demo for React, Angular and React Native. A hosted demo is
coming; until then, ask for a live demo at the contact in [`LICENSE.md`](LICENSE.md).

## License

Meridiana is commercial software. You may evaluate it for 30 days in a non-production environment;
any other use needs a license, purchased per developer, which lets you ship Meridiana inside your
applications to any number of end users without royalties. Without a key the views show a banner
and a large diagonal watermark. See [Licensing](docs/licensing.md), [`LICENSE.md`](LICENSE.md) and the
peer dependencies in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

© Moobi Tech S.r.l.s.
