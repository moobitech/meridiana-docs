# @moobitech/meridiana-angular

Angular components of [Meridiana](https://github.com/moobitech/meridiana-docs#readme): `<mer-time-grid>` (Day, 3 days, Week),
`<mer-month-grid>` (Month) and `<mer-agenda>` (Agenda), styled with Tailwind CSS, with drag, resize
and context menus.

```sh
npm install @moobitech/meridiana-core @moobitech/meridiana-angular @angular/cdk date-fns
```

```ts
import { provideMeridiana } from '@moobitech/meridiana-angular';

bootstrapApplication(App, {
  providers: [provideMeridiana({ locale: 'en-GB', weekStartsOn: 1, licenseKey: '…' })],
});
```

```html
<mer-time-grid
  [events]="events()"
  [viewDate]="viewDate()"
  [days]="7"
  [draggable]="true"
  [resizable]="true"
  (eventChange)="save($event)"
/>
```

Documentation: [Getting started](https://github.com/moobitech/meridiana-docs/blob/main/docs/getting-started.md), [Angular](https://github.com/moobitech/meridiana-docs/blob/main/docs/angular.md),
[Theming](https://github.com/moobitech/meridiana-docs/blob/main/docs/theming.md).

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/cdk` 22, `date-fns` 4. Commercial
license: see `LICENSE.md`.
