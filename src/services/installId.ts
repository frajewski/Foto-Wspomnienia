import * as Crypto from 'expo-crypto';

import { getSecret, setSecret } from './secureStore';

const INSTALL_ID_KEY = 'foto-wspomnienia:installId';

/**
 * Trwały identyfikator instancji aplikacji.
 * Generowany przy pierwszym uruchomieniu, przechowywany w SecureStore
 * (przeżyje czyszczenie cache, ale nie reinstalację aplikacji).
 *
 * Użycia (przyszłe): analytics, debug logging, korelacja zgłoszeń.
 * Trzymane w SecureStore, bo wartość identyfikuje urządzenie/instancję
 * i nie chcemy jej eksponować w plain-text AsyncStorage.
 */
export async function getOrCreateInstallId(): Promise<string> {
  const existing = await getSecret(INSTALL_ID_KEY);
  if (existing) return existing;

  const fresh = Crypto.randomUUID();
  await setSecret(INSTALL_ID_KEY, fresh);
  return fresh;
}
