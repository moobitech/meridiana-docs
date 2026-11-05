---
layout: home
titleTemplate: Calendar components for Angular, React and React Native
---

<HomeHero />

<Showcase />

<UsedBy />

<div class="home-section">

## Built for booking and scheduling

Five views and the interactions users expect, the same in Angular, React and React Native: one
engine computes the layouts, thin renderers draw them.

<FeatureGrid />

</div>

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

<div class="terms">

<div>

### Is Community for you?

The free Community plan covers the Angular and React views of one application, for
([`LICENSE.md`](/LICENSE#_3-community-plan), section 3):

- an individual, for non-commercial purposes;
- an open-source project under a license approved by the Open Source Initiative;
- an organization with **less than €1M of annual revenue** (affiliates included) and **at most 5
  developers** working with Meridiana.

</div>

<div>

### The versions you got stay licensed forever

Every version released during your subscription stays licensed even if you do not renew: your
application never breaks. Renew to use the versions released later
([`LICENSE.md`](/LICENSE#_4-license-grant), section 4).

The key is checked offline, on the device: no server, no tracking.

</div>

</div>

<PlanCards />

<LicenseRequest />

[Compare the plans →](/docs/pricing)

</div>

<ClosingCta />
