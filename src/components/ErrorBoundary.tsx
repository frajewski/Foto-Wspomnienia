import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: w produkcji podpiąć Sentry (lub inne narzędzie do crash reportingu)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Coś poszło nie tak
        </Text>
        <Text variant="bodyMedium" style={styles.message}>
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub uruchom aplikację ponownie.
        </Text>
        {__DEV__ && this.state.error ? (
          <ScrollView style={styles.debugBox} contentContainerStyle={styles.debugContent}>
            <Text variant="labelMedium" style={styles.debugLabel}>
              {this.state.error.name}: {this.state.error.message}
            </Text>
            {this.state.error.stack ? (
              <Text variant="bodySmall" style={styles.debugStack}>
                {this.state.error.stack}
              </Text>
            ) : null}
          </ScrollView>
        ) : null}
        <Button mode="contained" onPress={this.handleReset} style={styles.action}>
          Spróbuj ponownie
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  debugBox: {
    maxHeight: 240,
    width: '100%',
    marginVertical: 12,
  },
  debugContent: {
    padding: 12,
    gap: 8,
  },
  debugLabel: {
    fontFamily: 'monospace',
  },
  debugStack: {
    fontFamily: 'monospace',
  },
  action: {
    marginTop: 8,
  },
});
