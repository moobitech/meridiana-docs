# @moobitech/meridiana-react

React (DOM) components of [Meridiana](https://github.com/moobitech/meridiana-docs#readme): `MeridianaTimeGrid` (Day, 3 days, Week),
`MeridianaMonthGrid` and `MeridianaAgenda`, styled with Tailwind CSS, with drag, resize and a built-in
context menu. The entry point `@moobitech/meridiana-react/hooks` exports the same logic as hooks
without DOM (`useTimeGrid`, `useMonthGrid`, `useAgenda`), used by `@moobitech/meridiana-native`.

```sh
npm install @moobitech/meridiana-core @moobitech/meridiana-react date-fns
```

```tsx
import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-react';

<MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey="…">
  <MeridianaTimeGrid events={events} viewDate={new Date()} days={7} draggable resizable onEventChange={save} />
</MeridianaProvider>;
```

Documentation: [Getting started](https://github.com/moobitech/meridiana-docs/blob/main/docs/getting-started.md), [React](https://github.com/moobitech/meridiana-docs/blob/main/docs/react.md),
[Theming](https://github.com/moobitech/meridiana-docs/blob/main/docs/theming.md).

Peer dependencies: `react`, `react-dom` 19, `date-fns` 4. Commercial license: see `LICENSE.md`.
