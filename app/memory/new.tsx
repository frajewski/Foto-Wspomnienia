import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator, Button, HelperText, Text, TextInput } from 'react-native-paper';

import { CameraCapture } from '@/features/memories/components/CameraCapture';
import { createMemoryThunk } from '@/features/memories/memoriesThunks';
import { pickImageFromGallery } from '@/features/memories/services/imagePicker';
import { memorySchema, type MemoryFormValues } from '@/features/memories/validation';
import { useLocation, type LocationCoords } from '@/hooks/useLocation';
import { useAppDispatch } from '@/store/hooks';
import { useAppTheme } from '@/theme/useAppTheme';

type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; coords: LocationCoords }
  | { status: 'error'; message: string; canRetry: boolean; blocked: boolean };

export default function NewMemoryScreen() {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const { getCurrentLocation } = useLocation();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<LocationState>({ status: 'idle' });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolver = useMemo(() => zodResolver(memorySchema), []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MemoryFormValues>({
    resolver,
    defaultValues: { title: '', description: '' },
  });

  const fetchLocation = useCallback(async () => {
    setLocationState({ status: 'loading' });
    const result = await getCurrentLocation();
    if (result.status === 'granted') {
      setLocationState({ status: 'success', coords: result.coords });
      return;
    }
    const blocked = result.status === 'denied' && result.reason === 'permission-blocked';
    setLocationState({
      status: 'error',
      message: result.message,
      canRetry: !blocked,
      blocked,
    });
  }, [getCurrentLocation]);

  const handlePhotoTaken = useCallback(
    (uri: string) => {
      setImageUri(uri);
      setCameraOpen(false);
      void fetchLocation();
    },
    [fetchLocation],
  );

  const handleOpenCamera = useCallback(() => {
    setCameraOpen(true);
  }, []);

  const handleCloseCamera = useCallback(() => {
    setCameraOpen(false);
  }, []);

  const handlePickFromGallery = useCallback(async () => {
    const result = await pickImageFromGallery();
    if (result.status === 'success') {
      setImageUri(result.uri);
      void fetchLocation();
    } else if (result.status === 'denied') {
      Alert.alert(
        'Brak dostępu do galerii',
        result.message,
        result.canAskAgain
          ? [{ text: 'OK' }]
          : [
              { text: 'Anuluj', style: 'cancel' },
              { text: 'Otwórz ustawienia', onPress: () => Linking.openSettings() },
            ],
      );
    }
  }, [fetchLocation]);

  const handleOpenSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  const onSubmit = useCallback(
    async (data: MemoryFormValues) => {
      if (!imageUri || locationState.status !== 'success') return;
      setIsSubmitting(true);
      try {
        await dispatch(
          createMemoryThunk({
            sourceImageUri: imageUri,
            title: data.title?.trim() || undefined,
            description: data.description?.trim() || undefined,
            latitude: locationState.coords.latitude,
            longitude: locationState.coords.longitude,
            accuracy: locationState.coords.accuracy,
          }),
        ).unwrap();
        router.back();
      } catch (error) {
        Alert.alert(
          'Błąd zapisu',
          error instanceof Error
            ? error.message
            : 'Nie udało się zapisać wspomnienia. Spróbuj ponownie.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, imageUri, locationState],
  );

  const canSubmit = imageUri !== null && locationState.status === 'success' && !isSubmitting;

  if (cameraOpen) {
    return <CameraCapture onPhotoTaken={handlePhotoTaken} onClose={handleCloseCamera} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.preview}
            contentFit="cover"
            transition={150}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View
            style={[styles.previewPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}
          >
            <MaterialCommunityIcons
              name="image-outline"
              size={48}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Brak zdjęcia
            </Text>
          </View>
        )}

        <View style={styles.imageActions}>
          <Button
            mode={imageUri ? 'outlined' : 'contained'}
            icon="camera"
            onPress={handleOpenCamera}
            style={styles.imageButton}
          >
            Zrób zdjęcie
          </Button>
          <Button
            mode="outlined"
            icon="image-multiple-outline"
            onPress={handlePickFromGallery}
            style={styles.imageButton}
          >
            Wybierz z galerii
          </Button>
        </View>

        <View style={[styles.locationBox, { borderColor: theme.colors.outline }]}>
          {locationState.status === 'idle' ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Lokalizacja zostanie pobrana po wybraniu zdjęcia.
            </Text>
          ) : null}
          {locationState.status === 'loading' ? (
            <View style={styles.locationRow}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text variant="bodyMedium">Pobieranie lokalizacji…</Text>
            </View>
          ) : null}
          {locationState.status === 'success' ? (
            <View style={styles.locationRow}>
              <MaterialCommunityIcons
                name="map-marker-check"
                size={20}
                color={theme.colors.primary}
              />
              <View style={styles.locationTextWrap}>
                <Text variant="bodyMedium">
                  {locationState.coords.latitude.toFixed(5)},{' '}
                  {locationState.coords.longitude.toFixed(5)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Dokładność: ±{Math.round(locationState.coords.accuracy)} m
                </Text>
              </View>
            </View>
          ) : null}
          {locationState.status === 'error' ? (
            <View style={styles.locationError}>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker-alert-outline"
                  size={20}
                  color={theme.colors.error}
                />
                <Text variant="bodyMedium" style={{ color: theme.colors.error, flex: 1 }}>
                  {locationState.message}
                </Text>
              </View>
              {locationState.canRetry ? (
                <Button mode="text" compact onPress={fetchLocation}>
                  Spróbuj ponownie
                </Button>
              ) : (
                <Button mode="text" compact onPress={handleOpenSettings}>
                  Otwórz ustawienia
                </Button>
              )}
            </View>
          ) : null}
        </View>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Tytuł (opcjonalnie)"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                maxLength={80}
                mode="outlined"
                returnKeyType="next"
              />
              <HelperText type="error" visible={Boolean(errors.title)}>
                {errors.title?.message ?? ''}
              </HelperText>
            </View>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Opis (opcjonalnie)"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                maxLength={500}
                mode="outlined"
                multiline
                numberOfLines={4}
              />
              <HelperText type="error" visible={Boolean(errors.description)}>
                {errors.description?.message ?? ''}
              </HelperText>
            </View>
          )}
        />

        <View style={styles.formActions}>
          <Button mode="outlined" onPress={() => router.back()} disabled={isSubmitting}>
            Anuluj
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={!canSubmit}
            loading={isSubmitting}
          >
            Zapisz
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  previewPlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageButton: {
    flexGrow: 1,
    minWidth: 160,
  },
  locationBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationError: {
    gap: 4,
    alignItems: 'flex-start',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
});
