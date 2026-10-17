# @moobitech/meridiana-native

React Native and Expo components of [Meridiana](https://github.com/moobitech/meridiana-docs#readme): `MeridianaTimeGrid` (Day, 3 days,
Week), `MeridianaMonthGrid` and `MeridianaAgenda`, with Gesture Handler (long press to drag or
select, handles to resize), a bottom-sheet menu and Uniwind classes. The default theme uses the
color tokens of gluestack-ui.

```sh
npm install @moobitech/meridiana-core @moobitech/meridiana-react @moobitech/meridiana-native date-fns
npx expo install react-native-gesture-handler uniwind expo-application
```

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MeridianaProvider, MeridianaTimeGrid } from '@moobitech/meridiana-native';

<GestureHandlerRootView style={{ flex: 1 }}>
  <MeridianaProvider locale="en-GB" weekStartsOn={1} licenseKey="…">
    <MeridianaTimeGrid events={events} viewDate={new Date()} days={3} draggable resizable onEventChange={save} />
  </MeridianaProvider>
</GestureHandlerRootView>;
```

Documentation: [React Native](https://github.com/moobitech/meridiana-docs/blob/main/docs/react-native.md), [Theming](https://github.com/moobitech/meridiana-docs/blob/main/docs/theming.md#react-native).

Peer dependencies: `react` 19, `react-native`, `react-native-gesture-handler` 2, `expo-application`,
`@moobitech/meridiana-react`, `date-fns` 4; Uniwind in the application. React Native always needs a paid license (Web + Mobile): see `LICENSE.md`.
