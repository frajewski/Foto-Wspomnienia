import * as SecureStore from 'expo-secure-store';

/**
 * Cienki wrapper na expo-secure-store.
 *
 * 🔐 SecureStore vs AsyncStorage:
 *
 * | Cecha          | SecureStore                              | AsyncStorage                       |
 * |----------------|-------------------------------------------|------------------------------------|
 * | Szyfrowanie    | iOS Keychain / Android Keystore           | Brak — plain text na dysku         |
 * | Bezpieczeństwo | Bezpieczne nawet na rooted/jailbreak      | Czytelne po roocie/jailbreaku      |
 * | Limit rozmiaru | 2048 B per klucz na Androidzie            | Brak praktycznego limitu           |
 * | Wydajność      | Wolniejsze (Keychain/Keystore round-trip) | Szybkie I/O                        |
 * | Dostęp z dysku | Brak — tylko przez API                    | Pliki `RCTAsyncLocalStorage` na FS |
 *
 * Trzymaj w SecureStore:
 *   - tokeny OAuth, refresh tokens
 *   - PIN-y, hasła, klucze szyfrujące
 *   - identyfikatory wymagające ochrony (np. installId, którego nie chcesz ujawniać)
 *
 * Trzymaj w AsyncStorage:
 *   - preferencje, motyw, język
 *   - cache UI (lista wspomnień — dane lokalne, nie-poufne)
 *   - dane biznesowe nie wymagające ochrony
 */

export async function setSecret(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecret(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
