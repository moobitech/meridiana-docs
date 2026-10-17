---
layout: home

hero:
  name: Meridiana
  text: The calendar for booking and scheduling apps
  tagline: Agenda, Day, 3 days, Week and Month views for Angular, React and React Native, with drag, resize and context menus. Styled with Tailwind CSS.
  image:
    src: /hero.png
    alt: The week view of Meridiana
  actions:
    - theme: brand
      text: Get started
      link: /docs/getting-started
    - theme: alt
      text: Pricing
      link: /docs/pricing

features:
  - icon: 🗓️
    title: Five views
    details: Agenda, Day, 3 days, Week with excluded days, and Month with "+N more". The week shows three days on tablets and one on phones.
  - icon: ✋
    title: Drag, resize, touch
    details: Move and resize with snapping, auto-scroll and your own validation, by mouse, keyboard or long press. Meridiana reports the change; your app saves it.
  - icon: 🧩
    title: One engine, three frameworks
    details: Angular, React and React Native share the same engine, so every app behaves the same way. The core is plain TypeScript, to build your own renderer.
  - icon: 🎨
    title: Tailwind themes
    details: Every element takes its classes from a named slot and its colors from CSS variables. Restyle a few slots, or replace the whole theme.
  - icon: 📱
    title: Made for phones
    details: Long press, Gesture Handler, bottom sheet menus and colored dots in the month. Runs in Expo Go and on the web.
  - icon: 🔒
    title: Offline license
    details: The key is checked on the device. No server, no tracking, and the versions you got stay licensed forever.
---

<div class="home-section">

## Ten lines to a calendar

Install the packages, import the Tailwind entry next to Tailwind, and drop a view in your app.

::: code-group

```html [Angular]
<!-- provideMeridiana({ locale: 'en-GB', weekStartsOn: 1, licenseKey }) in app.config.ts -->
<mer-time-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [days]="7"
  [draggable]="true"
  [resizable]="true"
  (eventChange)="save($event)"
/>
```

```tsx [React]
import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-react';

<MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey={key}>
  <MeridianaTimeGrid events={events} viewDate={new Date()} days={7} draggable resizable onEventChange={save} />
</MeridianaProvider>;
```

```tsx [React Native]
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-native';

<GestureHandlerRootView style={{ flex: 1 }}>
  <MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey={key}>
    <MeridianaTimeGrid events={events} viewDate={new Date()} days={3} draggable resizable onEventChange={save} />
  </MeridianaProvider>
</GestureHandlerRootView>;
```

```css [Tailwind]
@import 'tailwindcss';
@import '@moobitech/meridiana';
```

:::

[Read the guide →](/docs/getting-started)

</div>

<div class="home-section">

## Free for the web, per application for business

The Angular and React views are free for individuals, open-source projects and small companies.
Commercial apps pay per application, with unlimited developers. React Native, and the
[resource timeline](/docs/roadmap) when it ships, are part of the paid plans.

<PlanCards />

[Compare the plans →](/docs/pricing)

</div>
