import { fireEvent, render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { theme } from '@/theme/theme';

const renderWithProviders = (children: ReactNode) =>
  render(<PaperProvider theme={theme}>{children}</PaperProvider>);

describe('EmptyState', () => {
  it('should render title and description', () => {
    const { getByText } = renderWithProviders(
      <EmptyState title="Brak danych" description="Tu pojawią się wpisy" />,
    );

    expect(getByText('Brak danych')).toBeTruthy();
    expect(getByText('Tu pojawią się wpisy')).toBeTruthy();
  });

  it('should render the CTA button and invoke the callback when pressed', () => {
    const onAction = jest.fn();
    const { getByText } = renderWithProviders(
      <EmptyState title="Pusto" actionLabel="Dodaj" onAction={onAction} />,
    );

    fireEvent.press(getByText('Dodaj'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should not render any button when actionLabel is missing', () => {
    const { queryByText } = renderWithProviders(<EmptyState title="Pusto" />);

    expect(queryByText('Dodaj')).toBeNull();
  });
});
