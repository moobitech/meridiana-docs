# React

`@moobitech/meridiana-react`: function components for React 19 (DOM), with no dependency besides
React and the core. The context menu is built in.

<!-- preview week -->

```tsx
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

<!-- /preview -->

## Installation

<!-- install -->

```sh
npm install @moobitech/meridiana \
  @moobitech/meridiana-core \
  @moobitech/meridiana-react \
  date-fns
```

<!-- /install -->

Import the Tailwind entry next to Tailwind (see [Installation](getting-started.md#2-tailwind-css)),
then wrap your app in the provider:

```tsx
import { MeridianaProvider } from '@moobitech/meridiana-react';

<MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey="…">
  <App />
</MeridianaProvider>;
```

## Usage

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

| Component | Views | Props and callbacks |
| --- | --- | --- |
| `MeridianaTimeGrid` | Day, 3 days, Week | [Time grid](time-grid.md#api-reference) |
| `MeridianaMonthGrid` | Month | [Month](month.md#api-reference) |
| `MeridianaAgenda` | Agenda | [Agenda](agenda.md#api-reference) |

The props have the names of the Angular inputs, with render props instead of templates:

| Prop | View | Receives |
| --- | --- | --- |
| `renderEvent` | time grid | `{ event, placed, timeLabel, compact, roomy, narrow, disabled }` |
| `renderEvent` | month | `row`: `{ event, timeLabel, disabled, … }` |
| `renderDot` | month | `row`: the mark of an event in a compact cell instead of the colored dot, e.g. an icon for a state |
| `renderEvent` | agenda | `row`: `{ event, item, timeLabel, disabled, … }` |
| `renderMenuItem` | all | the `CalendarMenuItem` |

## Hooks without DOM

The views are built on hooks that compute everything and draw nothing, in
`@moobitech/meridiana-react/hooks` (no `react-dom`): `useTimeGrid`, `useMonthGrid`, `useAgenda` and
the utilities around them. See [Hooks and helpers](api/hooks-and-helpers.md).
