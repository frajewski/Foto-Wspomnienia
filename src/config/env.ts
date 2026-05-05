/**
 * Wrapper na zmienne środowiskowe Expo.
 *
 * ❗ Tylko EXPO_PUBLIC_* są dostępne w bundle klienta (zob. https://docs.expo.dev/guides/environment-variables/).
 * Metro inline-uje wartości w czasie buildu — dlatego dostęp MUSI być literalny
 * (`process.env.EXPO_PUBLIC_FOO`), a nie dynamiczny (`process.env[name]`).
 * Eslint ma regułę `expo/no-dynamic-env-var` która tego pilnuje.
 *
 * 🚨 EXPO_PUBLIC_* są wbudowywane w bundle JS przy buildzie — każdy, kto rozpakuje
 * APK/IPA, je zobaczy. NIE TRZYMAJ TU SEKRETÓW. Do prawdziwych poświadczeń
 * potrzebny backend pośredniczący (frontend pyta backend, backend ma sekrety).
 *
 * Co można trzymać:
 *   - publiczne API keys z restrykcjami (Google Maps zawężony do bundle ID)
 *   - URL backendu
 *   - feature flagi
 *
 * Wszystkie wartości mogą być `null` jeśli nie ustawione — kod konsumujący
 * powinien graceful-fallbackować lub jawnie sprawdzać.
 */

interface AppEnv {
  mapsApiKey: string | null;
  apiBaseUrl: string | null;
}

function normalize(value: string | undefined): string | null {
  if (typeof value !== 'string' || value.length === 0) return null;
  return value;
}

export const env: AppEnv = {
  mapsApiKey: normalize(process.env.EXPO_PUBLIC_MAPS_API_KEY),
  apiBaseUrl: normalize(process.env.EXPO_PUBLIC_API_BASE_URL),
};
