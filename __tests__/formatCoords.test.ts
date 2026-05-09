import { formatCoords, formatCoordsDMS } from '@/utils/formatCoords';

describe('formatCoords (decimal)', () => {
  it('should format coordinates with 5 decimal precision by default', () => {
    expect(formatCoords({ latitude: 50.06143, longitude: 19.93658 })).toBe('50.06143, 19.93658');
  });

  it('should support custom precision', () => {
    expect(formatCoords({ latitude: 50.06143, longitude: 19.93658 }, 2)).toBe('50.06, 19.94');
  });

  it('should handle negative coordinates without losing the sign', () => {
    expect(formatCoords({ latitude: -33.86882, longitude: -73.45 })).toBe('-33.86882, -73.45000');
  });
});

describe('formatCoordsDMS (degrees-minutes-seconds)', () => {
  it('should render N and E suffixes for positive coordinates', () => {
    expect(formatCoordsDMS({ latitude: 50.06143, longitude: 19.93658 })).toMatch(
      /^50°\d{2}'\d{2}"N 19°\d{2}'\d{2}"E$/,
    );
  });

  it('should render S and W suffixes for negative coordinates', () => {
    expect(formatCoordsDMS({ latitude: -33.86882, longitude: -73.45 })).toMatch(
      /^33°\d{2}'\d{2}"S 73°\d{2}'\d{2}"W$/,
    );
  });
});
