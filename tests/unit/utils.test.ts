import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('slugify', () => {
    it('converts simple text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('handles special characters', () => {
      expect(slugify('My Project! @2024')).toBe('my-project-2024');
    });

    it('handles multiple spaces and dashes', () => {
      expect(slugify('test   multiple---dashes')).toBe('test-multiple-dashes');
    });

    it('trims leading and trailing dashes', () => {
      expect(slugify('---trimmed---')).toBe('trimmed');
    });
  });
});
