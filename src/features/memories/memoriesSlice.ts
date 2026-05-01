import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';
import type { Memory } from '@/types/memory';

import { createMemoryThunk, deleteMemoryThunk, loadMemoriesThunk } from './memoriesThunks';

export type MemoriesStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MemoriesState {
  items: Memory[];
  status: MemoriesStatus;
  error: string | null;
}

const initialState: MemoriesState = {
  items: [],
  status: 'idle',
  error: null,
};

const memoriesSlice = createSlice({
  name: 'memories',
  initialState,
  reducers: {
    setMemories(state, action: PayloadAction<Memory[]>) {
      state.items = action.payload;
    },
    addMemory(state, action: PayloadAction<Memory>) {
      state.items = [action.payload, ...state.items];
    },
    updateMemory(state, action: PayloadAction<Memory>) {
      const idx = state.items.findIndex((m) => m.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    },
    removeMemory(state, action: PayloadAction<string>) {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    setStatus(state, action: PayloadAction<MemoriesStatus>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMemoriesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadMemoriesThunk.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(loadMemoriesThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Nie udało się wczytać wspomnień.';
      })
      .addCase(createMemoryThunk.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(createMemoryThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'Nie udało się zapisać wspomnienia.';
      })
      .addCase(deleteMemoryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMemoryThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'Nie udało się usunąć wspomnienia.';
      });
  },
});

export const { setMemories, addMemory, updateMemory, removeMemory, setStatus, setError } =
  memoriesSlice.actions;

export const memoriesReducer = memoriesSlice.reducer;

// --- Selectors ---

export const selectAllMemories = (state: RootState): Memory[] => state.memories.items;
export const selectMemoriesStatus = (state: RootState): MemoriesStatus => state.memories.status;
export const selectMemoriesError = (state: RootState): string | null => state.memories.error;
export const selectMemoriesCount = createSelector(
  [selectAllMemories],
  (memories) => memories.length,
);

/**
 * Fabryka memoizowanego selektora po id — wywołaj raz w komponencie (useMemo)
 * i przekaż do useAppSelector, aby uniknąć ponownego tworzenia przy każdym renderze.
 */
export const selectMemoryById = (id: string) =>
  createSelector([selectAllMemories], (memories): Memory | undefined =>
    memories.find((m) => m.id === id),
  );
