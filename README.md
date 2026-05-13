# 📱 Foto Wspomnienia

Mobilna aplikacja do zapisywania wspomnień ze zdjęciami i lokalizacją — działa **w pełni offline**, wszystkie dane trzymane lokalnie na urządzeniu.

## 🎬 Screenshoty

> _Placeholder — uzupełnij gdy aplikacja zostanie zbudowana i uruchomiona._

| Lista wspomnień                       | Tworzenie                           | Mapa                                |
| ------------------------------------- | ----------------------------------- | ----------------------------------- |
| `![Lista](docs/screenshots/list.png)` | `![Nowe](docs/screenshots/new.png)` | `![Mapa](docs/screenshots/map.png)` |

Aby dodać screenshoty: zrób zdjęcie ekranu w symulatorze (`cmd+S` na iOS, narzędzie ekranowe w Android Studio), zapisz w `docs/screenshots/` i podmień ścieżki powyżej.

## ✨ Funkcjonalności

- 📷 **Zdjęcia** — z aparatu (`expo-camera`, przedni/tylny obiektyw) lub z galerii (`expo-image-picker`)
- 📍 **Lokalizacja** — automatycznie pobierana po wybraniu zdjęcia (`expo-location`, accuracy Balanced, timeout 15 s)
- 🗺️ **Mapa wspomnień** — wszystkie zdjęcia jako pinezki, bounding box, tap → szczegóły (`react-native-maps`)
- 💾 **Offline-first** — `AsyncStorage` jako źródło prawdy, działanie bez internetu
- 🌐 **Wskaźnik trybu offline** — globalny banner + dedykowany na mapie (kafelki mapy wymagają sieci)
- 🔐 **SecureStore** — trwały `installId` w Keychain/Keystore (do przyszłych analytics/telemetrii)
- ✍️ **Walidacja formularzy** — react-hook-form + zod (tytuł ≤ 80, opis ≤ 500), sanityzacja HTML/protokołów
- 🌍 **Polskie UI i komunikaty błędów** — mapowanie kodów Expo na user-friendly teksty
- 🧯 **Error Boundary** — fallback po polsku, dev-only stack trace, hook do Sentry (TODO)
- 📐 **Responsywność** — portrait + landscape, dynamiczne `numColumns` w FlatList (1 lub 2 kolumny)

## 🛠 Stack technologiczny

- **[Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)** + **[Expo Router](https://docs.expo.dev/router/introduction/)** (file-based routing, tabs + modal)
- **[React Native 0.81](https://reactnative.dev/)** + **React 19.1** + **New Architecture**
- **[TypeScript](https://www.typescriptlang.org/)** w trybie `strict` + `noUncheckedIndexedAccess`
- **[Redux Toolkit](https://redux-toolkit.js.org/)** + **[React Redux](https://react-redux.js.org/)** — state management
- **[React Native Paper](https://callstack.github.io/react-native-paper/)** (Material Design 3) — komponenty UI
- **[React Hook Form](https://react-hook-form.com/)** + **[zod](https://zod.dev/)** — formularze i walidacja
- **[date-fns](https://date-fns.org/)** (locale `pl`) — formatowanie dat
- **[Jest](https://jestjs.io/)** + **[@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)** — testy
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** + **[Husky](https://typicode.github.io/husky/)** + **[lint-staged](https://github.com/lint-staged/lint-staged)** — quality gates

## 🏗 Architektura

```
app/                      # Expo Router — ekrany (file = trasa)
src/
  components/             # Współdzielone komponenty UI (Screen, EmptyState, ErrorBoundary, …)
  features/
    memories/             # Domena "wspomnienia" — slice, thunks, validation, components, services
  hooks/                  # Globalne hooki natywne (useCameraPermission, useLocation, useNetworkStatus)
  services/               # Wrapery na zewnętrzne API (secureStore, errorMapper, installId)
  store/                  # Redux store + typed hooks
  theme/                  # MD3 theme rozszerzony o spacing/radius/typography
  types/                  # Współdzielone typy domenowe
  utils/                  # Pure helpery (formatCoords, formatDate, sanitize, networkCheck)
  config/                 # env.ts
__tests__/                # Testy (mirror struktury src/)
```

**Feature-based folder structure** — slice'y, hooki, komponenty i serwisy jednej domeny żyją obok siebie, co skraca odległość między "co" i "jak" przy dodawaniu funkcji. Globalne (cross-cutting) abstrakcje mają osobne katalogi.

## 🚀 Uruchomienie w < 5 minut

### Wymagania

- Node.js ≥ 20
- npm ≥ 10
- (opcjonalnie) Android Studio z emulatorem **lub** Xcode z symulatorem **lub** Expo Go na telefonie

### Kroki

```bash
git clone <repo-url>
cd "Foto Wspomnienia"
npm install
npx expo start
```

Po starcie Metro w terminalu pojawi się **QR code**:

- **Expo Go** (telefon) — zeskanuj kod aparatem (iOS) lub w aplikacji Expo Go (Android)
- **Android emulator** — naciśnij `a` w terminalu Metro
- **iOS simulator** (macOS only) — naciśnij `i` w terminalu Metro
- **Web** — naciśnij `w` (mapa/aparat nie działają, do quick check UI)

> ⚠️ Funkcje natywne (aparat, lokalizacja, mapa) wymagają **fizycznego urządzenia** lub emulatora z odpowiednią konfiguracją (Google Play Services, lokalizacja symulowana, etc.).

## 📦 Build EAS

```bash
npm install -g eas-cli       # jednorazowo
eas login                    # wymaga konta Expo
eas build --platform android --profile preview
```

Profil `preview` generuje **APK** z `distribution: internal` — gotowy do udostępnienia przez link/QR bez Play Store. Inne profile w `eas.json`:

- `development` — z `developmentClient`, do debug
- `production` — autoIncrement wersji, do Play/App Store

## 🧪 Testy

```bash
npm test                # jednokrotny przebieg
npm run test:watch      # watch mode
npm run test:coverage   # z raportem coverage (HTML w coverage/)
```

**9 suite, 34 testy** pokrywające: reducery Redux, repozytorium AsyncStorage, hooki natywne, formatery, sanityzację, walidację zod, ErrorBoundary, komponenty UI.

## 🔐 Bezpieczeństwo

- **SecureStore (`expo-secure-store`)** — `installId` szyfrowane w iOS Keychain / Android Keystore. `AsyncStorage` używamy tylko do danych nie-poufnych (lista wspomnień).
- **Zero kluczy w repo** — `.env.example` jako template, `.env*` w `.gitignore`. EXPO*PUBLIC*\* są inline-owane w bundle (dokumentacja w `src/config/env.ts`); **żaden sekret nie powinien iść tą drogą**.
- **Walidacja inputu** — zod schema (max length) + `sanitizeText` (strip HTML tags, `javascript:`/`data:`/`vbscript:` protokoły). Defense-in-depth: choć dziś nie renderujemy HTML, jutro może być eksport/sync.
- **HTTPS-only** — gdy wprowadzony zostanie backend, fetch wyłącznie po HTTPS; `withNetworkCheck` HOF już gotowy do owijania mutacji sieciowych.
- **Uprawnienia** — wszystkie permission prompts mają polskie opisy (`ios.infoPlist`/`android.permissions` w `app.json`). Obsługujemy `granted` / `denied (canAskAgain)` / `blocked (never ask again)` jawnie, ze ścieżką do ustawień systemowych.

## 📂 Struktura projektu (skrócona)

```
.
├── app/                            # Expo Router (file-based routes)
│   ├── _layout.tsx                 # Providers + ErrorBoundary + Snackbar + OfflineBanner
│   ├── (tabs)/
│   │   ├── _layout.tsx             # Tabs: Lista / Mapa / Ustawienia
│   │   ├── index.tsx               # Lista wspomnień (FlatList + FAB)
│   │   ├── map.tsx                 # MapView z markerami
│   │   └── settings.tsx            # Wersja / Uprawnienia / Dane
│   └── memory/
│       ├── [id].tsx                # Szczegóły wspomnienia (mini-mapa, delete)
│       └── new.tsx                 # Tworzenie (modal, form, kamera, galeria)
├── src/
│   ├── components/                 # ErrorBoundary, Screen, EmptyState, LoadingView, ErrorView, OfflineBanner, AsyncBoundary
│   ├── config/env.ts               # EXPO_PUBLIC_* wrapper
│   ├── features/memories/
│   │   ├── memoriesSlice.ts        # State + reducers + selectors
│   │   ├── memoriesThunks.ts       # Async thunks (load/create/delete)
│   │   ├── validation.ts           # zod schema
│   │   ├── components/             # MemoryCard, CameraCapture
│   │   └── services/               # imagePicker, imageStorage, memoriesRepository
│   ├── hooks/                      # useCameraPermission, useLocation, useNetworkStatus
│   ├── services/                   # secureStore, installId, errorMapper
│   ├── store/                      # store, typed hooks
│   ├── theme/                      # colors, typography, spacing, radius, theme, useAppTheme
│   ├── types/                      # memory.ts
│   └── utils/                      # formatCoords, formatDate, sanitize, networkCheck
├── __tests__/                      # Testy (mirror src/)
├── assets/images/                  # Ikony, splash
├── app.json                        # Expo config (permissions, plugins, theme colors)
├── eas.json                        # EAS Build profiles
├── eslint.config.js                # ESLint flat config
├── jest.setup.ts                   # Mocki natywnych modułów
├── tsconfig.json                   # strict + noUncheckedIndexedAccess + @/* → ./src/*
└── package.json
```

## 🎯 Decyzje architektoniczne

1. **Redux Toolkit zamiast Zustand/Jotai/Context** — RTK ma wbudowany `createAsyncThunk` z lifecycle (`pending/fulfilled/rejected`), immer, devtools i deterministyczne testy. Dla projektu z >1 slice'em i async I/O wygrywa na ergonomii. Zustand wygrałby przy mniejszej domenie.

2. **Expo Router zamiast React Navigation manual** — file-based routing eliminuje boilerplate `<Stack.Screen>`, automatycznie generuje typowane trasy (`experiments.typedRoutes: true`) i upraszcza modale (`presentation: 'modal'` na poziomie pliku). Trade-off: konwencja zamiast konfiguracji.

3. **React Native Paper (MD3) zamiast NativeBase/Tamagui** — najdojrzalsze wsparcie MD3, doskonała integracja z TypeScript (`useTheme<AppTheme>()`) i niewielki bundle. Tamagui wygrywałby gdyby zależało nam na compile-time tokens, ale tu MD3 jest priorytetem.

4. **Offline-first jako fundament, nie dodatek** — `AsyncStorage` jest źródłem prawdy, nie cache'em. Thunki najpierw zapisują do storage, dopiero potem aktualizują state — odwrócenie kolejności pozostawiałoby rozjazd przy crashu. Sieć (gdy będzie) działa jako _sync_, nie _load_.

5. **Feature-based foldery zamiast warstwowych** — `src/features/memories/` zawiera slice, thunks, components, services, validation. Skraca odległość przy zmianie i ułatwia ekstrakcję feature do osobnego pakietu w przyszłości. Cross-cutting (theme, error mapping) zostają w `src/` na poziomie roota.

## 📝 Licencja

MIT — szczegóły w pliku `LICENSE` (TODO: dodać plik gdy projekt będzie publiczny).

---

**Wersja Expo:** SDK 54 · **Node:** ≥ 20 · **Platformy:** iOS, Android, (Web — częściowo, bez aparatu/lokalizacji)
