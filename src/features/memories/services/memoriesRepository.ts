import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Memory } from '@/types/memory';

const STORAGE_KEY = 'memories:v1';
const SCHEMA_VERSION = 1;

interface PersistedShape {
  version: number;
  memories: Memory[];
}

/**
 * Migracje schematu — placeholder. Gdy zmienimy strukturę Memory,
 * dopisujemy tu kolejne kroki (np. 1 -> 2: rename pola, default values).
 * TODO: dodać konkretne migracje gdy schemat się zmieni.
 */
function migrate(raw: unknown): Memory[] {
  if (!raw || typeof raw !== 'object') return [];

  // Legacy: tablica bezpośrednio pod kluczem (przed wprowadzeniem version)
  if (Array.isArray(raw)) {
    return raw as Memory[];
  }

  const payload = raw as Partial<PersistedShape>;
  if (!Array.isArray(payload.memories)) return [];

  // Tu w przyszłości: if (payload.version === 1) -> migrate to 2 ...
  return payload.memories;
}

export async function loadAll(): Promise<Memory[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return migrate(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveAll(memories: Memory[]): Promise<void> {
  const payload: PersistedShape = { version: SCHEMA_VERSION, memories };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
