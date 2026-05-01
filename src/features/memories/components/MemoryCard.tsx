import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { useAppTheme } from '@/theme/useAppTheme';
import type { Memory } from '@/types/memory';

interface Props {
  memory: Memory;
  onPress: (id: string) => void;
}

const COMPACT_BREAKPOINT = 600;

function MemoryCardComponent({ memory, onPress }: Props) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < COMPACT_BREAKPOINT;

  const handlePress = useCallback(() => {
    onPress(memory.id);
  }, [memory.id, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.pressable}
      accessibilityRole="button"
      accessibilityLabel={memory.title ?? 'Wspomnienie bez tytułu'}
    >
      <Card mode="elevated" style={styles.card}>
        <Image
          source={{ uri: memory.imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.content}>
          <Text variant={isCompact ? 'titleSmall' : 'titleMedium'} numberOfLines={1}>
            {memory.title ?? 'Bez tytułu'}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {format(memory.createdAt, "d MMM yyyy 'o' HH:mm", { locale: pl })}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {memory.latitude.toFixed(4)}, {memory.longitude.toFixed(4)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

export const MemoryCard = memo(MemoryCardComponent);

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    margin: 6,
  },
  card: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  content: {
    padding: 12,
    gap: 4,
  },
});
