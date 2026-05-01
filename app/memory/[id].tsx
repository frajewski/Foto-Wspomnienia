import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { Screen } from '@/components/Screen';
import { selectMemoryById } from '@/features/memories/memoriesSlice';
import { deleteMemoryThunk } from '@/features/memories/memoriesThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/useAppTheme';

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const memorySelector = useMemo(() => selectMemoryById(id ?? ''), [id]);
  const memory = useAppSelector(memorySelector);
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  const handleDelete = useCallback(() => {
    if (!memory) return;
    Alert.alert(
      'Usunąć wspomnienie?',
      'Ta operacja jest nieodwracalna. Zdjęcie również zostanie usunięte.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMemoryThunk(memory.id)).unwrap();
              router.back();
            } catch {
              Alert.alert('Błąd', 'Nie udało się usunąć wspomnienia. Spróbuj ponownie.');
            }
          },
        },
      ],
    );
  }, [memory, dispatch]);

  if (!memory) {
    return (
      <Screen>
        <View style={styles.notFound}>
          <Text variant="titleLarge">Nie znaleziono wspomnienia</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Wspomnienie zostało usunięte lub nie istnieje.
          </Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.notFoundAction}>
            Wróć
          </Button>
        </View>
      </Screen>
    );
  }

  const formattedDate = format(memory.createdAt, "d MMMM yyyy 'o' HH:mm", { locale: pl });

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.scroll}
    >
      <Image
        source={{ uri: memory.imageUri }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.content}>
        <Text variant="headlineSmall">{memory.title ?? 'Bez tytułu'}</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {formattedDate}
        </Text>
        {memory.description ? (
          <Text variant="bodyMedium" style={styles.description}>
            {memory.description}
          </Text>
        ) : null}
        <View style={styles.coordsRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Lokalizacja: {memory.latitude.toFixed(5)}, {memory.longitude.toFixed(5)}
            {memory.accuracy !== undefined ? ` (±${Math.round(memory.accuracy)} m)` : ''}
          </Text>
        </View>
        <View style={[styles.mapWrapper, { borderColor: theme.colors.outline }]}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: memory.latitude,
              longitude: memory.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={{ latitude: memory.latitude, longitude: memory.longitude }} />
          </MapView>
        </View>
        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor={theme.colors.error}
          icon="delete-outline"
          style={styles.deleteAction}
        >
          Usuń wspomnienie
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  description: {
    marginTop: 4,
  },
  coordsRow: {
    flexDirection: 'row',
  },
  mapWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  deleteAction: {
    marginTop: 12,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundAction: {
    marginTop: 8,
  },
});
