import { z } from 'zod';

import { sanitizeText } from '@/utils/sanitize';

/**
 * Pole tekstowe walidowane długością na trimowanej wartości,
 * a następnie sanityzowane (strip HTML/protocols).
 *
 * Kolejność operacji jest istotna:
 *   1. trim       — limit liczy się od trimowanej długości (UX-friendly)
 *   2. max        — błąd walidacji widoczny dla użytkownika
 *   3. transform  — sanityzacja po przejściu walidacji
 *   4. optional   — pole nie jest wymagane
 */
const sanitizedField = (max: number, message: string) =>
  z.string().trim().max(max, message).transform(sanitizeText).optional();

export const memorySchema = z.object({
  title: sanitizedField(80, 'Tytuł może mieć maksymalnie 80 znaków.'),
  description: sanitizedField(500, 'Opis może mieć maksymalnie 500 znaków.'),
});

export type MemoryFormValues = z.infer<typeof memorySchema>;
