/**
 * Mapuje błędy z modułów Expo / RN / standardowych na user-friendly polskie teksty.
 * Dopasowuje po:
 *   1. `error.code` (Expo errors mają to pole)
 *   2. `error.name`
 *   3. fragmenty z `error.message`
 * Fallback: generyczny komunikat.
 */

const ERROR_MAP: Readonly<Record<string, string>> = {
  // expo-location
  E_LOCATION_TIMEOUT: 'Pobieranie lokalizacji trwało zbyt długo.',
  E_LOCATION_UNAUTHORIZED: 'Brak uprawnień do lokalizacji.',
  E_LOCATION_UNAVAILABLE: 'Lokalizacja niedostępna. Sprawdź czy GPS jest włączony.',
  E_LOCATION_SETTINGS_UNSATISFIED: 'Usługi lokalizacji są wyłączone w systemie.',
  E_NO_PERMISSIONS: 'Brak wymaganych uprawnień.',

  // expo-camera
  E_CAMERA_UNAVAILABLE: 'Aparat jest niedostępny.',
  E_CAMERA_UNAUTHORIZED: 'Brak uprawnień do aparatu.',

  // expo-image-picker
  E_PICKER_CANCELLED: 'Wybór anulowany.',
  E_PICKER_NO_LIBRARY_PERMISSION: 'Brak dostępu do galerii.',
  E_PICKER_NO_CAMERA_PERMISSION: 'Brak dostępu do aparatu.',

  // expo-file-system
  E_FILESYSTEM_CANNOT_READ: 'Nie udało się odczytać pliku.',
  E_FILESYSTEM_CANNOT_WRITE: 'Nie udało się zapisać pliku.',
  ENOENT: 'Plik nie istnieje.',
  EACCES: 'Brak uprawnień do pliku.',
  ENOSPC: 'Brak miejsca na urządzeniu.',

  // expo-secure-store
  E_SECURESTORE_DECRYPT_ERROR: 'Nie udało się odczytać zaszyfrowanych danych.',
  E_SECURESTORE_AUTH_ERROR: 'Uwierzytelnienie do magazynu zabezpieczeń nie powiodło się.',

  // sieć
  NetworkUnavailableError: 'Brak połączenia z internetem.',
  TIMEOUT: 'Przekroczono limit czasu operacji.',
} as const;

const DEFAULT_MESSAGE = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';

function hasStringProp<K extends string>(obj: unknown, key: K): obj is Record<K, string> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    key in obj &&
    typeof (obj as Record<string, unknown>)[key] === 'string'
  );
}

export function mapError(error: unknown): string {
  if (!error) return DEFAULT_MESSAGE;

  if (typeof error === 'string') {
    return ERROR_MAP[error] ?? error;
  }

  if (hasStringProp(error, 'code')) {
    const mapped = ERROR_MAP[error.code];
    if (mapped) return mapped;
  }

  if (hasStringProp(error, 'name')) {
    const mapped = ERROR_MAP[error.name];
    if (mapped) return mapped;
  }

  if (hasStringProp(error, 'message')) {
    const { message } = error;
    for (const [key, value] of Object.entries(ERROR_MAP)) {
      if (message.includes(key)) return value;
    }
    if (message.length > 0) return message;
  }

  return DEFAULT_MESSAGE;
}
