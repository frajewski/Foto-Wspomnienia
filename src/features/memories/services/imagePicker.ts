import * as ImagePicker from 'expo-image-picker';

export type ImagePickerResult =
  | { status: 'success'; uri: string }
  | { status: 'cancelled' }
  | {
      status: 'denied';
      canAskAgain: boolean;
      message: string;
    };

const MESSAGES = {
  blocked:
    'Dostęp do galerii jest zablokowany. Otwórz ustawienia systemu, aby włączyć uprawnienia.',
  denied: 'Uprawnienie do galerii nie zostało nadane.',
} as const;

export async function pickImageFromGallery(): Promise<ImagePickerResult> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (current.status !== ImagePicker.PermissionStatus.GRANTED) {
    if (!current.canAskAgain) {
      return { status: 'denied', canAskAgain: false, message: MESSAGES.blocked };
    }

    const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (requested.status !== ImagePicker.PermissionStatus.GRANTED) {
      return {
        status: 'denied',
        canAskAgain: requested.canAskAgain,
        message: requested.canAskAgain ? MESSAGES.denied : MESSAGES.blocked,
      };
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.7,
  });

  if (result.canceled) {
    return { status: 'cancelled' };
  }

  const asset = result.assets[0];
  if (!asset) {
    return { status: 'cancelled' };
  }

  return { status: 'success', uri: asset.uri };
}
