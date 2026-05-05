import NetInfo from '@react-native-community/netinfo';

export class NetworkUnavailableError extends Error {
  constructor() {
    super('Brak połączenia z internetem. Spróbuj ponownie, gdy odzyskasz łączność.');
    this.name = 'NetworkUnavailableError';
  }
}

/**
 * Higher-order util — wykonuje async operację tylko gdy mamy internet.
 * Placeholder dla przyszłych operacji sieciowych (sync, upload do backendu itp.).
 *
 * Obecnie aplikacja jest w pełni offline-first — wszystkie istotne operacje
 * (zapis, odczyt, GPS, obrazy) działają bez sieci. Mapa wymaga sieci do
 * pobierania kafelków, ale nie używamy tego wrappera — ostrzegamy bannerem.
 */
export async function withNetworkCheck<T>(fn: () => Promise<T>): Promise<T> {
  const state = await NetInfo.fetch();
  if (state.isConnected === false || state.isInternetReachable === false) {
    throw new NetworkUnavailableError();
  }
  return fn();
}
