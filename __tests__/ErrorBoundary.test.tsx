import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { theme } from '@/theme/theme';

const renderWithProviders = (children: ReactNode) =>
  render(<PaperProvider theme={theme}>{children}</PaperProvider>);

const Crashing = ({ message }: { message: string }): never => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  it('should render children unchanged when no error is thrown', () => {
    const { getByText } = renderWithProviders(
      <ErrorBoundary>
        <Text>Healthy child</Text>
      </ErrorBoundary>,
    );

    expect(getByText('Healthy child')).toBeTruthy();
  });

  it('should render the Polish fallback UI when a child throws during render', () => {
    // ErrorBoundary loguje przez console.error — wyciszamy żeby test był czysty
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { getByText } = renderWithProviders(
      <ErrorBoundary>
        <Crashing message="Boom" />
      </ErrorBoundary>,
    );

    expect(getByText('Coś poszło nie tak')).toBeTruthy();
    expect(getByText('Spróbuj ponownie')).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
