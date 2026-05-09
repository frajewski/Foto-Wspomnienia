export interface Coords {
  latitude: number;
  longitude: number;
}

/**
 * Formatuje koordynaty jako decimal z konfigurowalną precyzją.
 * Default 5 znaków po przecinku = precyzja ok. 1 metra.
 */
export function formatCoords({ latitude, longitude }: Coords, precision = 5): string {
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}

/**
 * Formatuje koordynaty w formacie DMS (degrees minutes seconds) z półkulami N/S/E/W.
 * Przykład: 50°03'41"N 19°56'12"E
 */
export function formatCoordsDMS({ latitude, longitude }: Coords): string {
  const latStr = `${toDMS(Math.abs(latitude))}${latitude >= 0 ? 'N' : 'S'}`;
  const lngStr = `${toDMS(Math.abs(longitude))}${longitude >= 0 ? 'E' : 'W'}`;
  return `${latStr} ${lngStr}`;
}

function toDMS(value: number): string {
  const deg = Math.floor(value);
  const minFloat = (value - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"`;
}
