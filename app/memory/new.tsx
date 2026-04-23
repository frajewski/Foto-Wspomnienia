import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Screen } from '@/components/Screen';

export default function NewMemoryScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="headlineSmall">Nowe wspomnienie</Text>
        <Text variant="bodyMedium">Formularz tworzenia wspomnienia pojawi się tutaj.</Text>
        <Button mode="outlined" onPress={() => router.back()} style={styles.action}>
          Anuluj
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  action: {
    marginTop: 8,
  },
});
