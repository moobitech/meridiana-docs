# @moobitech/meridiana

The Tailwind CSS entry of [Meridiana](https://github.com/moobitech/meridiana-docs#readme), the
calendar for Angular, React and React Native. Install it next to the package of your framework:

```sh
npm install @moobitech/meridiana @moobitech/meridiana-angular   # or -react, -native
```

```css
@import 'tailwindcss';
@import '@moobitech/meridiana';
```

`tailwind.css` points Tailwind to the classes in the JavaScript of the Meridiana packages: Tailwind
skips `node_modules`, so without it some classes are never generated, with no error. Import it with
any theme, your own too: the components carry layout classes of their own. It also brings the color
tokens of the default web theme (`--mer-*`, with a dark palette under `.dark`); a theme of your own
ignores them.

Documentation: [Getting started](https://github.com/moobitech/meridiana-docs/blob/main/docs/getting-started.md), [Theming](https://github.com/moobitech/meridiana-docs/blob/main/docs/theming.md).

Commercial license: see `LICENSE.md`.
