import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAppTheme } from '@/theme/useAppTheme';

interface Props {
  /** Niestandardowy komunikat (np. specyficzny dla ekranu mapy). */
  message?: string;
  /** Pomija safe-area top inset (gdy banner renderujemy wewnątrz ekranu, który już go uwzględnił). */
  ignoreTopInset?: boolean;
}

const DEFAULT_MESSAGE = 'Tryb offline — niektóre funkcje mogą być niedostępne.';

function OfflineBannerComponent({ message, ignoreTopInset = false }: Props) {
  const { isConnected } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  if (isConnected !== false) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.errorContainer,
          paddingTop: ignoreTopInset ? styles.banner.paddingVertical : insets.top + 6,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <MaterialCommunityIcons name="wifi-off" size={16} color={theme.colors.onErrorContainer} />
      <Text variant="bodySmall" style={[styles.text, { color: theme.colors.onErrorContainer }]}>
        {message ?? DEFAULT_MESSAGE}
      </Text>
    </View>
  );
}

export const OfflineBanner = memo(OfflineBannerComponent);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    flex: 1,
  },
});
