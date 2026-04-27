import { useCameraPermissions, type PermissionResponse } from 'expo-camera';
import { useCallback } from 'react';
import { Linking } from 'react-native';

export type CameraPermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

export interface UseCameraPermissionResult {
  status: CameraPermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  message: string | null;
  requestPermission: () => Promise<PermissionResponse>;
  openSettings: () => Promise<void>;
}

function deriveStatus(permission: PermissionResponse | null): CameraPermissionStatus {
  if (!permission) return 'undetermined';
  if (permission.granted) return 'granted';
  if (!permission.canAskAgain) return 'blocked';
  if (permission.status === 'denied') return 'denied';
  return 'undetermined';
}

function deriveMessage(status: CameraPermissionStatus): string | null {
  switch (status) {
    case 'denied':
      return 'Aplikacja potrzebuje dostępu do aparatu, aby robić zdjęcia wspomnień. Nadaj uprawnienia, aby kontynuować.';
    case 'blocked':
      return 'Dostęp do aparatu został zablokowany. Otwórz ustawienia systemu, aby włączyć uprawnienia ręcznie.';
    default:
      return null;
  }
}

export function useCameraPermission(): UseCameraPermissionResult {
  const [permission, requestPermission] = useCameraPermissions();
  const status = deriveStatus(permission);

  const openSettings = useCallback(async (): Promise<void> => {
    await Linking.openSettings();
  }, []);

  return {
    status,
    granted: status === 'granted',
    canAskAgain: permission?.canAskAgain ?? true,
    message: deriveMessage(status),
    requestPermission,
    openSettings,
  };
}
