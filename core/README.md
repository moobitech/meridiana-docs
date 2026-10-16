# @moobitech/meridiana-core

The engine of [Meridiana](https://github.com/moobitech/meridiana-docs#readme), the calendar for Angular, React and React Native: view
layouts (Day, 3 days, Week, Month, Agenda), navigation, the move and resize state machine and the
Tailwind theme. Plain TypeScript, no UI. The renderers `@moobitech/meridiana-angular`,
`@moobitech/meridiana-react` and `@moobitech/meridiana-native` build on it.

```sh
npm install @moobitech/meridiana-core date-fns
```

```ts
import { getTimeGridView } from '@moobitech/meridiana-core';

const view = getTimeGridView({ viewDate: new Date(), days: 7, events });
// view.days[i].events[j] → { offsetMinutes, durationMinutes, left, width, level, … }
```

`theme.css` holds the color tokens of the default web theme:
`@import '@moobitech/meridiana-core/theme.css';`.

Documentation: [Core engine](https://github.com/moobitech/meridiana-docs/blob/main/docs/core.md), [Theming](https://github.com/moobitech/meridiana-docs/blob/main/docs/theming.md),
[Events and interactions](https://github.com/moobitech/meridiana-docs/blob/main/docs/events-and-interactions.md).

Peer dependency: `date-fns` 4. Commercial license: see `LICENSE.md`.
