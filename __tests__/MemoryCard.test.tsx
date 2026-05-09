import { fireEvent, render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';

import { MemoryCard } from '@/features/memories/components/MemoryCard';
import { theme } from '@/theme/theme';
import type { Memory } from '@/types/memory';

const memory: Memory = {
  id: 'memory-id-42',
  imageUri: 'file:///photo.jpg',
  title: 'Krakowskie zaułki',
  latitude: 50.06143,
  longitude: 19.93658,
  createdAt: new Date('2024-01-15T10:30:00.000Z').getTime(),
};

const renderWithProviders = (children: ReactNode) =>
  render(<PaperProvider theme={theme}>{children}</PaperProvider>);

describe('MemoryCard', () => {
  it('should render title and formatted date for a memory with title', () => {
    const { getByText } = renderWithProviders(
      <MemoryCard memory={memory} onPress={() => undefined} />,
    );

    expect(getByText('Krakowskie zaułki')).toBeTruthy();
    expect(getByText(/sty 2024/i)).toBeTruthy();
  });

  it('should fall back to "Bez tytułu" when title is missing', () => {
    const { getByText } = renderWithProviders(
      <MemoryCard memory={{ ...memory, title: undefined }} onPress={() => undefined} />,
    );

    expect(getByText('Bez tytułu')).toBeTruthy();
  });

  it('should call onPress with the memory id when card is pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithProviders(<MemoryCard memory={memory} onPress={onPress} />);

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith('memory-id-42');
  });
});
