import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

const MEMORIES_DIRNAME = 'memories';
const MEMORIES_DIR = `${FileSystem.documentDirectory ?? ''}${MEMORIES_DIRNAME}/`;

async function ensureMemoriesDir(): Promise<void> {
  if (!FileSystem.documentDirectory) {
    throw new Error('Brak dostępu do dokumentów aplikacji — nie można zapisać zdjęcia.');
  }
  const info = await FileSystem.getInfoAsync(MEMORIES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MEMORIES_DIR, { intermediates: true });
  }
}

export async function saveImage(sourceUri: string): Promise<string> {
  await ensureMemoriesDir();
  const uuid = Crypto.randomUUID();
  const targetUri = `${MEMORIES_DIR}${uuid}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: targetUri });
  return targetUri;
}

export async function deleteImage(uri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}
