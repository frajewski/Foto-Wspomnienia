import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CameraView, type CameraType } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useAppTheme } from '@/theme/useAppTheme';

interface Props {
  onPhotoTaken: (uri: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onPhotoTaken, onClose }: Props) {
  const theme = useAppTheme();
  const { status, granted, canAskAgain, message, requestPermission, openSettings } =
    useCameraPermission();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    setCaptureError(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        onPhotoTaken(photo.uri);
      } else {
        setCaptureError('Nie udało się zapisać zdjęcia. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error('CameraCapture: takePictureAsync failed', error);
      setCaptureError('Nie udało się zrobić zdjęcia. Spróbuj ponownie.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onPhotoTaken]);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  if (status === 'undetermined') {
    return (
      <View style={[styles.container, styles.permissionContainer, styles.black]}>
        <SafeAreaView style={styles.permissionInner}>
          <MaterialCommunityIcons name="camera" size={64} color="#FFFFFF" />
          <Text variant="titleLarge" style={styles.permissionTitle}>
            Dostęp do aparatu
          </Text>
          <Text variant="bodyMedium" style={styles.permissionText}>
            Aby zrobić zdjęcie wspomnienia, aplikacja potrzebuje dostępu do aparatu.
          </Text>
          <Button mode="contained" onPress={requestPermission} style={styles.permissionAction}>
            Nadaj uprawnienia
          </Button>
          <Button mode="text" textColor="#FFFFFF" onPress={onClose}>
            Anuluj
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  if (!granted) {
    return (
      <View
        style={[
          styles.container,
          styles.permissionContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <SafeAreaView style={styles.permissionInner}>
          <MaterialCommunityIcons
            name="camera-off-outline"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, textAlign: 'center' }}>
            Brak dostępu do aparatu
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.permissionText, { color: theme.colors.onSurfaceVariant }]}
          >
            {message ?? 'Aplikacja nie ma dostępu do aparatu.'}
          </Text>
          {canAskAgain ? (
            <Button mode="contained" onPress={requestPermission} style={styles.permissionAction}>
              Spróbuj ponownie
            </Button>
          ) : (
            <Button mode="contained" onPress={openSettings} style={styles.permissionAction}>
              Otwórz ustawienia
            </Button>
          )}
          <Button mode="text" onPress={onClose}>
            Anuluj
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.black]}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="box-none">
          <Pressable
            onPress={onClose}
            hitSlop={16}
            style={styles.iconButton}
            accessibilityLabel="Zamknij aparat"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        {captureError ? (
          <View style={styles.errorBanner}>
            <Text variant="bodySmall" style={styles.errorText}>
              {captureError}
            </Text>
          </View>
        ) : null}

        <View style={styles.bottomBar} pointerEvents="box-none">
          <View style={styles.bottomSide} />
          <Pressable
            onPress={handleCapture}
            disabled={isCapturing}
            style={({ pressed }) => [
              styles.shutter,
              pressed && styles.shutterPressed,
              isCapturing && styles.shutterDisabled,
            ]}
            accessibilityLabel="Zrób zdjęcie"
            accessibilityRole="button"
            accessibilityState={{ disabled: isCapturing }}
          >
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.bottomSide}>
            <Pressable
              onPress={toggleFacing}
              disabled={isCapturing}
              hitSlop={16}
              style={styles.iconButton}
              accessibilityLabel="Przełącz aparat"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="camera-flip-outline" size={32} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  black: {
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  bottomSide: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: {
    opacity: 0.7,
  },
  shutterDisabled: {
    opacity: 0.4,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  errorBanner: {
    marginHorizontal: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(179, 38, 30, 0.85)',
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permissionContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  permissionInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  permissionTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
  },
  permissionAction: {
    marginTop: 8,
  },
});
