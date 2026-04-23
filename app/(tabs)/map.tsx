import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function MapScreen() {
  return (
    <Screen edges={['left', 'right', 'bottom']} noPadding>
      <EmptyState
        icon="map-outline"
        title="Mapa wspomnień"
        description="Tu pojawi się mapa z lokalizacjami Twoich wspomnień."
      />
    </Screen>
  );
}
