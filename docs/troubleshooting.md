# Troubleshooting

The problems people meet most often, what causes them and how to fix them.

## Elements out of place, no error

**Cause:** Tailwind did not generate some classes of Meridiana. The classes live in the JavaScript
of the packages, in `node_modules`, and Tailwind v4 skips `node_modules`. There is no error, and it
is easy to miss, because your app may already use most of the same classes.

**Fix:** import `@moobitech/meridiana` next to Tailwind, in the CSS entry of Tailwind (web) or of
Uniwind (React Native), also when you use a theme of your own: the components carry layout classes
that no slot replaces.

```css
@import 'tailwindcss';
@import '@moobitech/meridiana';
```

If a tool in your CSS pipeline does not resolve the `style` condition of package exports (a bundler
or a `postcss-import` setup outside Tailwind v4), import the same file by its path:
`@import '@moobitech/meridiana/tailwind.css';`. See [Installation](getting-started.md#2-tailwind-css).

## "Meridiana · unlicensed" on the views

The views show a banner and a diagonal watermark, and the console one warning, whenever the key is
not valid for this version, this application and these views. The banner says why;
`getLicenseStatus()` from `@moobitech/meridiana-core` returns the same status.

| Status | Cause | Fix |
| --- | --- | --- |
| `missing` | No key set. | Pass `licenseKey` to the provider, or call `setLicenseKey(key)` before the first calendar renders. |
| `invalid` | Not a Meridiana key, or edited. | Copy the key again, whole: it is `<payload>.<signature>`. |
| `expired` | This version was released after the end of your subscription. | Stay on a version released before that day, or renew. |
| `wrong-app` | The key is for another application. | See below. |
| `missing-product` | The plan of the key does not include these views, for example React Native with a Web plan. | Use the views of your plan, or change plan. |

Details: [Licensing](licensing.md).

## The key works on one host and not on another

**Cause:** a key lists the hosts and bundle ids of one application (`app.example.com`;
`*.example.com` covers the domain and its subdomains). On the web the application is the host of the
page, on iOS and Android the bundle id. `localhost`, `*.localhost`, `127.0.0.1`, `::1` and Expo Go
always work, with a key set; addresses of the local network (`192.168.…`) do not, unless the key
lists them.

**Fix:** a new host or bundle id of the same application needs only a new key, free: ask for it
with your order id. Another application needs its own license. When the host is unknown, as in
server-side rendering, the application is not checked there: the browser checks it again.

## Install errors about date-fns

**Cause:** the core has `date-fns` ^4 as a peer dependency: npm refuses, or warns about, another
major version.

**Fix:** install `date-fns` 4 next to Meridiana.

## React Native: gestures, height and peers

- **Peers:** `react` ^19, `react-native` 0.88+, `react-native-gesture-handler` ^3 (Expo SDK 58+),
  `expo-application` (the bundle id, for the license key) and `@moobitech/meridiana-react`; Uniwind
  in the application. Install the native ones with `npx expo install` so that they match your SDK.
- **Nothing moves:** wrap the app in `GestureHandlerRootView`, with `flex: 1` in its style.
- **Nothing shows, or nothing scrolls:** give the calendar a parent with a height (`flex: 1`): the
  time grid and the Agenda scroll inside it.
- **Classes ignored on a third-party component** (e.g. `SafeAreaView` of
  react-native-safe-area-context): with Uniwind it does not take `className`. Give it a `style`, and
  the classes to a `View` inside.
- **A monorepo that consumes the TypeScript sources of the packages:** Metro must resolve their
  `./file.js` imports to `.ts` files. The published packages need nothing.

See [React Native](react-native.md).

## A moved event jumps back

**Cause:** Meridiana does not change your events. It reports the change (`onEventChange` /
`eventChange`) and keeps drawing the `events` you pass.

**Fix:** save the change and pass the updated events. A change that `validateChange` refuses is
shown as invalid and dropped. See [Move and resize](events-and-interactions.md#move-and-resize).

## The view recomputes all the time

**Cause:** the function inputs (`eventMenu`, `isEventDisabled`, …) change on every render. In React
a new function recomputes the view.

**Fix:** in React pass stable functions (`useCallback`). In Angular pass class fields with arrow
functions, so that `this` is your component and the inputs do not change on every change
detection. See [React](react.md) and [Angular](angular.md).
