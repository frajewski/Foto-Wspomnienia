import { memorySchema } from '@/features/memories/validation';

describe('memorySchema', () => {
  it('should accept input within length limits', () => {
    const result = memorySchema.safeParse({
      title: 'Wakacje w Tatrach',
      description: 'Piękny dzień w Morskim Oku',
    });

    expect(result.success).toBe(true);
  });

  it('should accept empty/missing fields', () => {
    const result = memorySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject title longer than 80 characters with a Polish message', () => {
    const result = memorySchema.safeParse({ title: 'a'.repeat(81) });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('80');
    }
  });

  it('should reject description longer than 500 characters', () => {
    const result = memorySchema.safeParse({ description: 'x'.repeat(501) });

    expect(result.success).toBe(false);
  });

  it('should strip HTML tags from the input after validation', () => {
    const result = memorySchema.safeParse({
      title: '<script>alert(1)</script>Cześć',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('alert(1)Cześć');
    }
  });

  it('should strip javascript: pseudo-protocol', () => {
    const result = memorySchema.safeParse({
      description: 'Klik javascript:alert(1) tutaj',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).not.toContain('javascript:');
    }
  });
});
