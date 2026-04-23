import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function MemoryListScreen() {
  return (
    <Screen edges={['left', 'right', 'bottom']} noPadding>
      <EmptyState
        icon="image-multiple-outline"
        title="Brak wspomnień"
        description="Dodaj pierwsze wspomnienie, aby zacząć budować swoją kolekcję."
        actionLabel="Dodaj wspomnienie"
        onAction={() => router.push('/memory/new')}
      />
    </Screen>
  );
}
