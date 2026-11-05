# Hooks and helpers

What the views are built on, to draw your own markup or a renderer for another platform, and the
helpers for your templates and menus.

## React hooks

The views are built on hooks that compute everything and draw nothing. Import them from
`@moobitech/meridiana-react/hooks` (no `react-dom`) to build your own markup, or a renderer for
another platform: `@moobitech/meridiana-native` uses them.

| Hook | Returns |
| --- | --- |
| `useTimeGrid(options, width, gutter?)` | `columns` (days with slots and placed events, boxes in pixels and percent), `timeLabels`, `endLabel`, `nowLine`, `visibleDays`, `gridHeight`, `pixelsPerMinute` |
| `useMonthGrid(options)` | `weeks` of cells with rows, dots and "+N", `weekdays`, `title` |
| `useAgenda(options)` | days with their rows and time labels |
| `useMeridianaOptions()` | the provider options |
| `useMeridianaClasses(theme?)` | the merged theme |

The options of `useTimeGrid`, `useMonthGrid` and `useAgenda` are the props of the matching view
without the render props and callbacks: see [Time grid](../time-grid.md#api-reference),
[Month](../month.md#api-reference) and [Agenda](../agenda.md#api-reference).

## React utilities

Utilities: `eventColorStyle(event)` (CSS variables of an event), `flag(on)` (a `data-*` value),
`cx(...classes)`, `useContextMenu()` (`openAt` for `onContextMenu`, `openAtPoint`, `openBelow`) and
`ContextMenu` (the built-in menu, to reuse in your own components), `useLongPress()` (long press with
a finger, as the views use it for their menus).

## Angular

- `eventColorStyle(event)`: the CSS variables of an event's color, for your own templates.
- `MeridianaContextMenuComponent`: the menu used by the views, if you open one yourself with
  `cdkContextMenuTriggerFor`.

## React Native

`@moobitech/meridiana-native` exports `useMeridianaOptions` from the React hooks, its theme
(`meridianaNativeTheme`, `useNativeClasses(theme?)`, which merges a view's `theme` over the
provider's), `flag(on)` (a `data-*` state with the value `true`, as Uniwind expects on iOS and
Android), `cx(...classes)`, and the bottom-sheet menu of the views (`BottomSheetMenu`, `useBottomSheetMenu()`).

## Core

Layouts, navigation, formatting, the interaction state machine and the license check, with no UI:
see [Core engine](../core.md).
