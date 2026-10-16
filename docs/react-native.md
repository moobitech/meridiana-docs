# React Native

`@moobitech/meridiana-native` — the Day, 3 days, Week, Month and Agenda views for React Native and
Expo, with [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) for touch and
[Uniwind](https://uniwind.dev) for the Tailwind classes. It runs in Expo Go and on the web through
react-native-web.

## Setup

```sh
npm install @moobitech/meridiana-core @moobitech/meridiana-react @moobitech/meridiana-native date-fns
npx expo install react-native-gesture-handler uniwind
```

1. Configure Uniwind as its documentation says (`withUniwindConfig` in `metro.config.js`, a CSS entry).
2. Add the classes of Meridiana to the CSS entry:

   ```css
   @import 'tailwindcss';
   @import 'uniwind';
   @source '../node_modules/@moobitech/meridiana-native';
   ```

3. Wrap the app in `GestureHandlerRootView` and the provider:

   ```tsx
   import { GestureHandlerRootView } from 'react-native-gesture-handler';
   import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-native';

   export default function App() {
     return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         <MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey="…">
           <MeridianaTimeGrid events={events} viewDate={new Date()} days={3} responsive draggable resizable />
         </MeridianaProvider>
       </GestureHandlerRootView>
     );
   }
   ```

Give the calendar a parent with a height (`flex: 1`): the time grid and the Agenda scroll inside it.

## Gestures

| Gesture | Time grid | Month | Agenda |
| --- | --- | --- | --- |
| Tap | opens the event; on an empty slot, `onSlotClick` | opens the day | opens the event / the day |
| Long press on an event | drags it if the finger moves, otherwise **selects** it; on an event that cannot change, opens its menu | opens its menu | opens its menu |
| Long press on an empty slot or a cell | opens the slot / day menu | opens the day menu | |
| Swipe | scrolls the grid | | scrolls the list |

A **selected** event has a highlighted border (`data-selected`), moves with a plain drag and shows two
handles — at the top left and the bottom right, with a touch area of about 44px — to resize it. A
tap on an empty slot, a tap on another event or a new period ends the selection. Dragging near the
top or bottom edge scrolls the grid.

The menus open in a **bottom sheet** (`BottomSheetMenu`), styled by the slots `contextMenu`,
`contextMenuItem` and `contextMenuItemText`. On a selected event, and on events with room for it,
the "⋯" button (`showEventMenuButton`) opens the menu too.

## Components

The props are those of the React components (see [React](react.md)), with these differences:

| Component | Extra props | Not available |
| --- | --- | --- |
| `MeridianaTimeGrid` | `longPressMs` (default 350) | `maxHeight` (use the parent's height), `showSlotTime` |
| `MeridianaMonthGrid` | | |
| `MeridianaAgenda` | | |

`theme` takes a `Partial<MeridianaNativeTheme>`; `renderEvent` and `renderMenuItem` return React
Native elements.

## Theme

The default theme (`meridianaNativeTheme`) uses the color tokens of **gluestack-ui** with Uniwind:
`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`,
`text-primary-foreground`, `bg-secondary`, `bg-muted`, `bg-popover`, `text-destructive`. An app built
with gluestack-ui gets a calendar in its colors, light and dark (`Uniwind.setTheme`). Other apps
define those colors in their Uniwind theme or pass their own slots to the provider.

React Native differs from the web in three ways, described in [Theming](theming.md#react-native):
text slots, `data-*` states with the value `true`, event colors as styles.

## Notes

- Third-party components do not take `className` with Uniwind (e.g. `SafeAreaView` from
  react-native-safe-area-context): give them a `style`, and the classes to a `View` inside.
- In a monorepo that consumes the TypeScript sources of the packages, Metro must resolve the
  `./file.js` imports of the sources to `.ts` files; the published packages need nothing.
