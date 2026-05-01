import { createAsyncThunk } from '@reduxjs/toolkit';
import * as Crypto from 'expo-crypto';

import type { RootState } from '@/store/store';
import type { Memory } from '@/types/memory';

import * as memoriesRepository from './services/memoriesRepository';
import { deleteImage, saveImage } from './services/imageStorage';

export interface CreateMemoryInput {
  sourceImageUri: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const loadMemoriesThunk = createAsyncThunk<Memory[]>('memories/load', async () => {
  return memoriesRepository.loadAll();
});

export const createMemoryThunk = createAsyncThunk<Memory, CreateMemoryInput, { state: RootState }>(
  'memories/create',
  async (input, { getState }) => {
    const persistedImageUri = await saveImage(input.sourceImageUri);

    const memory: Memory = {
      id: Crypto.randomUUID(),
      imageUri: persistedImageUri,
      title: input.title,
      description: input.description,
      latitude: input.latitude,
      longitude: input.longitude,
      accuracy: input.accuracy,
      createdAt: Date.now(),
    };

    const updated = [memory, ...getState().memories.items];
    await memoriesRepository.saveAll(updated);
    return memory;
  },
);

export const deleteMemoryThunk = createAsyncThunk<string, string, { state: RootState }>(
  'memories/delete',
  async (id, { getState }) => {
    const target = getState().memories.items.find((m) => m.id === id);
    if (target) {
      // best-effort — plik mógł już zniknąć
      await deleteImage(target.imageUri).catch(() => undefined);
    }
    const updated = getState().memories.items.filter((m) => m.id !== id);
    await memoriesRepository.saveAll(updated);
    return id;
  },
);
