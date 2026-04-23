import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function SettingsScreen() {
  return (
    <Screen edges={['left', 'right', 'bottom']} noPadding>
      <EmptyState
        icon="cog-outline"
        title="Ustawienia"
        description="Tu pojawią się ustawienia aplikacji."
      />
    </Screen>
  );
}
