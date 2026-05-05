/**
 * Usuwa znaczniki HTML/XML i sekwencje skryptowe z tekstu użytkownika.
 *
 * Defense-in-depth: aplikacja nie renderuje wpisanych pól jako HTML,
 * ale sanityzujemy przed zapisem do storage, aby:
 *   1. trzymać czyste dane (na wypadek przyszłego eksportu/sync z backendem)
 *   2. nie ufać input danym — zasada Trust Boundary at System Edges
 *
 * Reguły:
 *   - usuwa znaczniki HTML <...>
 *   - usuwa pseudo-protokoły javascript:/data: (nawet po niestandardowych białych znakach)
 *   - przycina spacje z brzegów
 */
export function sanitizeText(value: string): string {
  return value
    .trim()
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\b(?:javascript|data|vbscript)\s*:/gi, '')
    .replace(/[<>]/g, '');
}
