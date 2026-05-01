import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { selectAllMemories } from '@/features/memories/memoriesSlice';
import { useAppSelector } from '@/store/hooks';

function computeRegion(latitudes: number[], longitudes: number[]): Region {
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latitudeDelta = Math.max(maxLat - minLat, 0.01) * 1.4;
  const longitudeDelta = Math.max(maxLng - minLng, 0.01) * 1.4;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}

export default function MapScreen() {
  const memories = useAppSelector(selectAllMemories);

  const region = useMemo<Region | undefined>(() => {
    if (memories.length === 0) return undefined;
    return computeRegion(
      memories.map((m) => m.latitude),
      memories.map((m) => m.longitude),
    );
  }, [memories]);

  if (memories.length === 0) {
    return (
      <Screen edges={['left', 'right', 'bottom']} noPadding>
        <EmptyState
          icon="map-marker-off-outline"
          title="Brak wspomnień na mapie"
          description="Dodaj pierwsze wspomnienie z lokalizacją, aby zobaczyć je tutaj."
        />
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {memories.map((memory) => (
          <Marker
            key={memory.id}
            coordinate={{ latitude: memory.latitude, longitude: memory.longitude }}
            title={memory.title ?? 'Bez tytułu'}
            description={memory.description ?? undefined}
            onCalloutPress={() => router.push(`/memory/${memory.id}`)}
            onPress={() => router.push(`/memory/${memory.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
