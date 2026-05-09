import { formatMemoryDate, formatMemoryDateShort } from '@/utils/formatDate';

describe('formatDate', () => {
  it('should format a full memory date in Polish with full month name', () => {
    // Używam dat construct z UTC żeby uniknąć ślizgów strefy czasowej w CI
    const date = new Date(2024, 0, 15, 10, 30).getTime();
    expect(formatMemoryDate(date)).toBe('15 stycznia 2024 o 10:30');
  });

  it('should format a short memory date with abbreviated month', () => {
    const date = new Date(2024, 2, 5, 8, 15).getTime();
    expect(formatMemoryDateShort(date)).toMatch(/^5 mar 2024 o 08:15$/);
  });

  it('should pad single-digit hours and minutes to two digits', () => {
    const date = new Date(2024, 5, 7, 9, 5).getTime();
    expect(formatMemoryDate(date)).toContain('o 09:05');
  });
});
