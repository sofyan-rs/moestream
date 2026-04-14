# Moestream

An [Expo](https://expo.dev) anime streaming client for Android and iOS. It uses [Expo Router](https://docs.expo.dev/router/introduction) for file-based navigation, loads catalog and playback metadata from a REST API, and keeps watch progress and lists on-device.

## Requirements

- Node.js (LTS recommended)
- Xcode (iOS) and/or Android Studio (Android) — needed to compile the native projects produced by **Expo Prebuild**

## Native projects (Expo Prebuild)

This app uses **[continuous native generation](https://docs.expo.dev/workflow/prebuild/)**: the `ios` and `android` folders are **not** committed (they are gitignored). They are generated from `app.json` and config plugins whenever you run prebuild.

Generate native directories and install CocoaPods on iOS:

```bash
npm install
npx expo prebuild
```

After that, run on a simulator or device (these commands use the generated native projects):

```bash
npx expo run:ios
# or
npx expo run:android
```

If you change native-facing config (plugins, permissions, package name, etc.), run `npx expo prebuild` again — use `npx expo prebuild --clean` if native projects are out of sync.

For day-to-day JS work you can use Metro only:

```bash
npx expo start
```

Then launch the app from the already-built dev client, or use `expo run:*` so the binary matches your machine.

**Expo Go** does not include this project’s native dependencies (for example MMKV and `react-native-video` plugins), so use a **development build** from prebuild, not Expo Go.

## Scripts

| Command | Description |
| -------- | ----------- |
| `npm start` | Start Metro (`expo start`) |
| `npm run android` | Run Android app (uses prebuilt `android/`) |
| `npm run ios` | Run iOS app (uses prebuilt `ios/`) |
| `npm run web` | Web target (if enabled) |
| `npm run lint` | Run Expo ESLint |
| `npx expo prebuild` | Generate or refresh `ios/` and `android/` from config |

## Configuration

- **API base URL:** set in [`src/constants/api-url.ts`](src/constants/api-url.ts) (`ApiClient`). Point this at your backend before running the app.

## Architecture (overview)

- **`app/`** — Routes and layouts (tabs, anime stacks, shared list screens such as history and new episodes).
- **`src/features/`** — Screens and UI by area: home, detail, episode player, search, watchlist, history, and so on.
- **`src/hooks/stores/`** — [Zustand](https://github.com/pmndrs/zustand) stores persisted with [MMKV](https://github.com/mrousavy/react-native-mmkv) (for example watchlist and per-episode watch history).
- **`src/services/api/`** — Axios API modules used with [TanStack Query](https://tanstack.com/query).

## Features

- Home feed (ongoing, popular, continue watching).
- Anime detail and paginated episode lists.
- In-app episode playback ([react-native-video](https://github.com/TheWidlarzGroup/react-native-video)) with server and quality selection.
- **Watchlist** and **watch history** stored locally; history shows the latest progress per series, with full per-episode data used for episode grid progress indicators.
- Search, new episodes, and popular series list routes.

## Tech stack

- Expo ~54, React 19, React Native
- **Expo Prebuild** for `ios` / `android` (config plugins for `react-native-video`, MMKV, etc.)
- Expo Router, TanStack Query, Axios
- HeroUI Native, Uniwind (Tailwind-style classes)
- MMKV + Zustand for persisted client state

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
