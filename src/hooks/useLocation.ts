import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type LocationResult =
  | { status: 'granted'; coords: LocationCoords }
  | {
      status: 'denied';
      reason: 'permission-denied' | 'permission-blocked';
      message: string;
    }
  | {
      status: 'error';
      reason: 'no-gps' | 'timeout' | 'unknown';
      message: string;
    };

export interface UseLocationResult {
  isLoading: boolean;
  getCurrentLocation: () => Promise<LocationResult>;
}

const TIMEOUT_MS = 15_000;

const MESSAGES = {
  blocked:
    'Dostęp do lokalizacji jest zablokowany. Otwórz ustawienia systemu, aby włączyć uprawnienia.',
  denied: 'Uprawnienie do lokalizacji nie zostało nadane.',
  noGps: 'Usługi lokalizacji są wyłączone. Włącz GPS i spróbuj ponownie.',
  timeout: 'Pobieranie lokalizacji trwało zbyt długo. Spróbuj ponownie.',
  unknown: 'Nie udało się pobrać lokalizacji. Spróbuj ponownie.',
} as const;

async function ensureForegroundPermission(): Promise<LocationResult | null> {
  const current = await Location.getForegroundPermissionsAsync();

  if (current.status === Location.PermissionStatus.GRANTED) {
    return null;
  }

  if (!current.canAskAgain) {
    return {
      status: 'denied',
      reason: 'permission-blocked',
      message: MESSAGES.blocked,
    };
  }

  const requested = await Location.requestForegroundPermissionsAsync();
  if (requested.status === Location.PermissionStatus.GRANTED) {
    return null;
  }

  return {
    status: 'denied',
    reason: requested.canAskAgain ? 'permission-denied' : 'permission-blocked',
    message: requested.canAskAgain ? MESSAGES.denied : MESSAGES.blocked,
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export function useLocation(): UseLocationResult {
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = useCallback(async (): Promise<LocationResult> => {
    setIsLoading(true);
    try {
      const permissionDenial = await ensureForegroundPermission();
      if (permissionDenial) return permissionDenial;

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        return { status: 'error', reason: 'no-gps', message: MESSAGES.noGps };
      }

      try {
        const position = await withTimeout(
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          TIMEOUT_MS,
        );
        return {
          status: 'granted',
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy ?? 0,
            timestamp: position.timestamp,
          },
        };
      } catch (error) {
        const isTimeout = error instanceof Error && error.message === 'timeout';
        return {
          status: 'error',
          reason: isTimeout ? 'timeout' : 'unknown',
          message: isTimeout ? MESSAGES.timeout : MESSAGES.unknown,
        };
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, getCurrentLocation };
}
