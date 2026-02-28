import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/utils';

describe('Slugification Utility', () => {
  it('converts basic strings correctly', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('handles special characters', () => {
    expect(slugify('Next.js & Supabase! @2026')).toBe('nextjs-supabase-2026');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify(' --- Hello --- ')).toBe('hello');
  });

  it('handles multiple spaces', () => {
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
  });
});
