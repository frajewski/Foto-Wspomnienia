import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/useAppTheme';

interface Props {
  children: ReactNode;
  edges?: readonly Edge[];
  noPadding?: boolean;
  style?: ViewStyle;
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'left', 'right'];

export function Screen({ children, edges = DEFAULT_EDGES, noPadding = false, style }: Props) {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        !noPadding && { padding: theme.spacing.lg },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
