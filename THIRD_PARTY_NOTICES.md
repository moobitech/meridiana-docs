# Meridiana — Third-party notices

Meridiana does not bundle third-party code. `@moobitech/meridiana-core` depends on these packages,
installed with it, to check the license key:

| Package | Used by | License |
| --- | --- | --- |
| `@noble/ed25519` | `@moobitech/meridiana-core` | MIT |
| `@noble/hashes` | `@moobitech/meridiana-core` | MIT |

It works with these peer dependencies, which the application installs under their own license:

| Package | Used by | License |
| --- | --- | --- |
| `date-fns` | `@moobitech/meridiana-core` | MIT |
| `@angular/core`, `@angular/common`, `@angular/cdk` | `@moobitech/meridiana-angular` | MIT |
| `react` | `@moobitech/meridiana-react`, `@moobitech/meridiana-native` | MIT |
| `react-dom` | `@moobitech/meridiana-react` | MIT |
| `react-native`, `react-native-gesture-handler` | `@moobitech/meridiana-native` | MIT |
| `expo-application` (the bundle id, for the license key) | `@moobitech/meridiana-native` | MIT |
| `uniwind` (in the application, to turn the classes into styles) | `@moobitech/meridiana-native` | MIT |
