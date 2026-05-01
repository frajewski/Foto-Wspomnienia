import { router } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  type ListRenderItem,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { FAB, Text } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { MemoryCard } from '@/features/memories/components/MemoryCard';
import { selectAllMemories, selectMemoriesStatus } from '@/features/memories/memoriesSlice';
import { loadMemoriesThunk } from '@/features/memories/memoriesThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/useAppTheme';
import type { Memory } from '@/types/memory';

const TWO_COL_BREAKPOINT = 600;

function pluralizeMemories(count: number): string {
  if (count === 1) return '1 wspomnienie';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} wspomnienia`;
  }
  return `${count} wspomnień`;
}

export default function MemoryListScreen() {
  const dispatch = useAppDispatch();
  const memories = useAppSelector(selectAllMemories);
  const status = useAppSelector(selectMemoriesStatus);
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const numColumns = width >= TWO_COL_BREAKPOINT ? 2 : 1;

  useEffect(() => {
    dispatch(loadMemoriesThunk());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(loadMemoriesThunk());
  }, [dispatch]);

  const handlePressMemory = useCallback((id: string) => {
    router.push(`/memory/${id}`);
  }, []);

  const handlePressNew = useCallback(() => {
    router.push('/memory/new');
  }, []);

  const renderItem = useCallback<ListRenderItem<Memory>>(
    ({ item }) => <MemoryCard memory={item} onPress={handlePressMemory} />,
    [handlePressMemory],
  );

  const keyExtractor = useCallback((item: Memory) => item.id, []);

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {pluralizeMemories(memories.length)}
        </Text>
      </View>
    ),
    [memories.length, theme.colors.onSurfaceVariant],
  );

  const isLoading = status === 'loading';

  if (memories.length === 0 && status !== 'loading') {
    return (
      <Screen edges={['left', 'right', 'bottom']} noPadding>
        <EmptyState
          icon="image-multiple-outline"
          title="Brak wspomnień"
          description="Dodaj pierwsze wspomnienie, aby zacząć budować swoją kolekcję."
          actionLabel="Dodaj pierwsze wspomnienie"
          onAction={handlePressNew}
        />
      </Screen>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        key={numColumns}
        data={memories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        windowSize={10}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />
      <FAB
        icon="plus"
        onPress={handlePressNew}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        accessibilityLabel="Dodaj wspomnienie"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    paddingBottom: 96,
  },
  header: {
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
