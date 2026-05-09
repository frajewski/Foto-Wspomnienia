import { configureStore } from '@reduxjs/toolkit';

import {
  addMemory,
  memoriesReducer,
  removeMemory,
  setError,
  updateMemory,
} from '@/features/memories/memoriesSlice';
import type { Memory } from '@/types/memory';

const makeMemory = (overrides: Partial<Memory> = {}): Memory => ({
  id: 'mem-default',
  imageUri: 'file:///test/image.jpg',
  latitude: 50.06143,
  longitude: 19.93658,
  createdAt: 1_700_000_000_000,
  ...overrides,
});

const createTestStore = () => configureStore({ reducer: { memories: memoriesReducer } });

describe('memoriesSlice', () => {
  it('should prepend the memory when addMemory is dispatched', () => {
    const store = createTestStore();
    const first = makeMemory({ id: 'a' });
    const second = makeMemory({ id: 'b' });

    store.dispatch(addMemory(first));
    store.dispatch(addMemory(second));

    expect(store.getState().memories.items.map((m) => m.id)).toEqual(['b', 'a']);
  });

  it('should remove only the targeted memory when removeMemory is dispatched', () => {
    const store = createTestStore();
    store.dispatch(addMemory(makeMemory({ id: 'keep' })));
    store.dispatch(addMemory(makeMemory({ id: 'drop' })));

    store.dispatch(removeMemory('drop'));

    expect(store.getState().memories.items.map((m) => m.id)).toEqual(['keep']);
  });

  it('should update the matching memory in place when updateMemory is dispatched', () => {
    const store = createTestStore();
    store.dispatch(addMemory(makeMemory({ id: 'mem-1', title: 'Original' })));

    store.dispatch(updateMemory(makeMemory({ id: 'mem-1', title: 'Zmienione' })));

    expect(store.getState().memories.items[0]?.title).toBe('Zmienione');
  });

  it('should set both error message and status to "error" when setError is dispatched with text', () => {
    const store = createTestStore();

    store.dispatch(setError('Coś poszło nie tak'));

    expect(store.getState().memories.error).toBe('Coś poszło nie tak');
    expect(store.getState().memories.status).toBe('error');
  });

  it('should clear the error message without changing status when setError(null)', () => {
    const store = createTestStore();
    store.dispatch(setError('Błąd'));
    expect(store.getState().memories.status).toBe('error');

    store.dispatch(setError(null));

    expect(store.getState().memories.error).toBeNull();
    expect(store.getState().memories.status).toBe('error');
  });
});
