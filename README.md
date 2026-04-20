# Foto Wspomnienia

Aplikacja React Native (Expo) do zapisywania wspomnień ze zdjęciami i lokalizacją.

> Placeholder — pełna dokumentacja zostanie uzupełniona w ostatnim kroku.

## Stack

- Expo SDK 54 + Expo Router (file-based routing, tabs)
- TypeScript (strict + `noUncheckedIndexedAccess`)
- Redux Toolkit + React Redux
- React Native Paper (Material Design 3)
- expo-camera / expo-image-picker / expo-location / expo-media-library
- react-native-maps
- react-hook-form + zod
- Jest + Testing Library

## Skrypty

```bash
npm start          # Expo dev server
npm run android    # Otwórz na Androidzie
npm run ios        # Otwórz na iOS
npm run web        # Otwórz w przeglądarce

npm run lint       # ESLint
npm run lint:fix   # ESLint --fix
npm run format     # Prettier --write
npm run typecheck  # tsc --noEmit
npm test           # Jest
```
