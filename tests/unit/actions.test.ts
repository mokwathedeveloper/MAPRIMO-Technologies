import { describe, it, expect } from 'vitest';
import { handleActionError } from '@/lib/actions/portfolio';

describe('Action Error Handler', () => {
  it('converts AUTH string to structured AUTH error', async () => {
    const result = await handleActionError('AUTH');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('AUTH');
      expect(result.error.message).toContain('Unauthorized');
    }
  });

  it('converts DB: error string to structured DB error', async () => {
    const result = await handleActionError('DB:Relation not found');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('DB');
      expect(result.error.message).toBe('Relation not found');
    }
  });

  it('handles generic Error objects', async () => {
    const result = await handleActionError(new Error('Something went wrong'));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('UNKNOWN');
      expect(result.error.message).toBe('Something went wrong');
    }
  });
});
