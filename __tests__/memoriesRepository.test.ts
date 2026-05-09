import AsyncStorage from '@react-native-async-storage/async-storage';

import { clearAll, loadAll, saveAll } from '@/features/memories/services/memoriesRepository';
import type { Memory } from '@/types/memory';

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const sampleMemory: Memory = {
  id: 'mem-1',
  imageUri: 'file:///test/memories/photo.jpg',
  title: 'Wakacje',
  description: 'Zakopane 2024',
  latitude: 49.299,
  longitude: 19.948,
  accuracy: 8,
  createdAt: 1_700_000_000_000,
};

describe('memoriesRepository', () => {
  beforeEach(() => {
    mockedAsyncStorage.setItem.mockReset();
    mockedAsyncStorage.getItem.mockReset();
    mockedAsyncStorage.removeItem.mockReset();
  });

  it('should round-trip memories through saveAll and loadAll', async () => {
    let storedValue: string | null = null;
    mockedAsyncStorage.setItem.mockImplementation(async (_key, value) => {
      storedValue = value;
    });
    mockedAsyncStorage.getItem.mockImplementation(async () => storedValue);

    await saveAll([sampleMemory]);
    const loaded = await loadAll();

    expect(loaded).toEqual([sampleMemory]);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      'memories:v1',
      expect.stringContaining('"version":1'),
    );
  });

  it('should return an empty array when storage is empty', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);

    await expect(loadAll()).resolves.toEqual([]);
  });

  it('should accept legacy raw-array payload (pre-versioned schema)', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([sampleMemory]));

    await expect(loadAll()).resolves.toEqual([sampleMemory]);
  });

  it('should call AsyncStorage.removeItem when clearAll is invoked', async () => {
    await clearAll();
    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('memories:v1');
  });
});
