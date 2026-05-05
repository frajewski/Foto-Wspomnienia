import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Snackbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';
import { selectMemoriesError, setError } from '@/features/memories/memoriesSlice';
import { getOrCreateInstallId } from '@/services/installId';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { store } from '@/store/store';
import { theme } from '@/theme/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Trwały identyfikator aplikacji — generowany raz, trzymany w SecureStore.
    void getOrCreateInstallId();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <ErrorBoundary>
              <View style={styles.root}>
                <OfflineBanner />
                <Stack
                  screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTitleStyle: { color: theme.colors.onSurface },
                    headerTintColor: theme.colors.primary,
                    contentStyle: { backgroundColor: theme.colors.background },
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="memory/[id]" options={{ title: 'Wspomnienie' }} />
                  <Stack.Screen
                    name="memory/new"
                    options={{ presentation: 'modal', title: 'Nowe wspomnienie' }}
                  />
                </Stack>
                <ErrorSnackbar />
                <StatusBar style="auto" />
              </View>
            </ErrorBoundary>
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

function ErrorSnackbar() {
  const error = useAppSelector(selectMemoriesError);
  const dispatch = useAppDispatch();

  const handleDismiss = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return (
    <Snackbar
      visible={error !== null}
      onDismiss={handleDismiss}
      duration={5000}
      action={{ label: 'OK', onPress: handleDismiss }}
    >
      {error ?? ''}
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
