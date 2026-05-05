import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, List, Text } from 'react-native-paper';

import {
  selectAllMemories,
  selectMemoriesCount,
  setMemories,
} from '@/features/memories/memoriesSlice';
import { deleteImage } from '@/features/memories/services/imageStorage';
import { clearAll as clearMemoriesStorage } from '@/features/memories/services/memoriesRepository';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { getOrCreateInstallId } from '@/services/installId';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/useAppTheme';

function permissionLabel(status: string): string {
  switch (status) {
    case 'granted':
      return 'Nadane';
    case 'denied':
      return 'Odmówione';
    case 'blocked':
      return 'Zablokowane';
    default:
      return 'Nieokreślone';
  }
}

function permissionColor(status: string, theme: ReturnType<typeof useAppTheme>): string {
  switch (status) {
    case 'granted':
      return theme.colors.primary;
    case 'blocked':
    case 'denied':
      return theme.colors.error;
    default:
      return theme.colors.onSurfaceVariant;
  }
}

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const memories = useAppSelector(selectAllMemories);
  const memoriesCount = useAppSelector(selectMemoriesCount);
  const camera = useCameraPermission();
  const [locationPermission] = Location.useForegroundPermissions();
  const theme = useAppTheme();
  const [installId, setInstallId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getOrCreateInstallId()
      .then((id) => {
        if (mounted) setInstallId(id);
      })
      .catch(() => {
        if (mounted) setInstallId(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const appVersion = Constants.expoConfig?.version ?? '–';
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    null;

  const locationStatus: string = (() => {
    if (!locationPermission) return 'undetermined';
    if (locationPermission.granted) return 'granted';
    if (!locationPermission.canAskAgain) return 'blocked';
    return 'denied';
  })();

  const handleClearMemories = useCallback(() => {
    if (memoriesCount === 0) return;
    Alert.alert(
      'Wyczyścić wszystkie wspomnienia?',
      `Usunięte zostanie ${memoriesCount} wspomnień wraz ze zdjęciami. Tej operacji nie można cofnąć.`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Wyczyść',
          style: 'destructive',
          onPress: async () => {
            await Promise.allSettled(memories.map((m) => deleteImage(m.imageUri)));
            await clearMemoriesStorage();
            dispatch(setMemories([]));
          },
        },
      ],
    );
  }, [memories, memoriesCount, dispatch]);

  const handleOpenSystemSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.scroll}
    >
      <List.Section>
        <List.Subheader>O aplikacji</List.Subheader>
        <List.Item
          title="Wersja"
          description={buildNumber ? `${appVersion} (${buildNumber})` : appVersion}
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
        <List.Item
          title="ID instalacji"
          description={installId ?? 'Generowanie…'}
          descriptionNumberOfLines={1}
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Uprawnienia</List.Subheader>
        <List.Item
          title="Aparat"
          description={permissionLabel(camera.status)}
          left={(props) => <List.Icon {...props} icon="camera-outline" />}
          right={() => (
            <View style={styles.statusDot}>
              <MaterialCommunityIcons
                name="circle"
                size={12}
                color={permissionColor(camera.status, theme)}
              />
            </View>
          )}
        />
        <List.Item
          title="Lokalizacja"
          description={permissionLabel(locationStatus)}
          left={(props) => <List.Icon {...props} icon="map-marker-outline" />}
          right={() => (
            <View style={styles.statusDot}>
              <MaterialCommunityIcons
                name="circle"
                size={12}
                color={permissionColor(locationStatus, theme)}
              />
            </View>
          )}
        />
        <View style={styles.sectionAction}>
          <Button mode="outlined" icon="cog-outline" onPress={handleOpenSystemSettings}>
            Otwórz ustawienia systemowe
          </Button>
        </View>
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Dane</List.Subheader>
        <List.Item
          title="Zapisane wspomnienia"
          description={`${memoriesCount}`}
          left={(props) => <List.Icon {...props} icon="image-multiple-outline" />}
        />
        <View style={styles.sectionAction}>
          <Button
            mode="outlined"
            icon="trash-can-outline"
            onPress={handleClearMemories}
            disabled={memoriesCount === 0}
            textColor={theme.colors.error}
          >
            Wyczyść wszystkie wspomnienia
          </Button>
        </View>
      </List.Section>

      <Text variant="bodySmall" style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}>
        Foto Wspomnienia · {appVersion}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  statusDot: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  sectionAction: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footer: {
    textAlign: 'center',
    marginTop: 16,
  },
});
