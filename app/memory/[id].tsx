import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Screen } from '@/components/Screen';
import { useAppTheme } from '@/theme/useAppTheme';

type MemoryDetailParams = {
  id: string;
};

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams<MemoryDetailParams>();
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="headlineSmall">Wspomnienie</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          ID: {id ?? 'brak'}
        </Text>
        <Text variant="bodyMedium">Szczegóły wspomnienia pojawią się tutaj.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
