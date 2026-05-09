import { format, formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * Pełna data wspomnienia: "15 stycznia 2024 o 10:30".
 * Stosowane na ekranie szczegółów.
 */
export function formatMemoryDate(timestamp: number): string {
  return format(timestamp, "d MMMM yyyy 'o' HH:mm", { locale: pl });
}

/**
 * Krótka data: "15 sty 2024 o 10:30".
 * Stosowane w kartach na liście.
 */
export function formatMemoryDateShort(timestamp: number): string {
  return format(timestamp, "d MMM yyyy 'o' HH:mm", { locale: pl });
}

/**
 * Relatywna data: "2 dni temu", "5 minut temu".
 * Do użycia gdy zależy nam na świeżości a nie konkretnej dacie.
 */
export function formatRelative(timestamp: number): string {
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: pl });
}
