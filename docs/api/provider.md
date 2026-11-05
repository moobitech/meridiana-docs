# Provider and options

Set the locale, the first day of the week, the license key and the theme once, for every view of
the application. Every view also takes `locale`, `weekStartsOn` and `theme` as inputs, which win
over the provider.

<!-- tabs -->

```ts [Angular]
// Angular
import { provideMeridiana } from '@moobitech/meridiana-angular';

bootstrapApplication(App, {
  providers: [provideMeridiana({ locale: 'en-GB', weekStartsOn: 1, licenseKey: '…' })],
});
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

## Options

The options of `provideMeridiana()` (Angular) and the props of `MeridianaProvider` (React, React
Native):

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `locale` | `string` | the device locale | BCP 47 locale of dates and times, e.g. `it-IT`, formatted with `Intl`. |
| `weekStartsOn` | `WeekDay` (`0` … `6`) | `1` (Monday) | `0` = Sunday … `6` = Saturday. |
| `licenseKey` | `string` | — | The license key: the provider calls `setLicenseKey` with it. See [Licensing](../licensing.md). |
| `theme` | `Partial<MeridianaTheme>` | the default theme | Slots that replace the default classes; build it with `createMeridianaTheme()` to extend instead. See [Theme slots](theme-slots.md). |
| `children` (React) | `ReactNode` | — | Your application. |

On React Native `theme` takes a `Partial<MeridianaNativeTheme>`: its slots replace those of
`meridianaNativeTheme`.

Without a provider the views use the defaults: weeks from Monday, the default theme, the device
locale, no key.

## Reading the options

- Angular: inject `MERIDIANA_OPTIONS` (`MeridianaOptions`: `locale`, `weekStartsOn`, `theme` as a
  complete theme, `licenseKey`).
- React and React Native: `useMeridianaOptions()` returns the same `MeridianaOptions`;
  `useMeridianaClasses(theme?)` returns the theme with a view's slots over the provider's.

## License key without a provider

Call `setLicenseKey(key)` from `@moobitech/meridiana-core` before the first calendar renders.
`getLicenseStatus({ product, app })` tells whether the key is valid here: see
[Core engine](../core.md#license-key) and [Licensing](../licensing.md).
