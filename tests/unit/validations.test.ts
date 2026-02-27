import { describe, it, expect } from 'vitest';
import { leadSchema, projectSchema, podcastSchema } from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('leadSchema', () => {
    it('validates a correct lead object', () => {
      const validLead = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME Corp',
        message: 'I need a new MVP in 4 weeks.',
      };
      const result = leadSchema.safeParse(validLead);
      expect(result.success).toBe(true);
    });

    it('fails on invalid email', () => {
      const invalidLead = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'Short',
      };
      const result = leadSchema.safeParse(invalidLead);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Invalid email address');
      }
    });
  });

  describe('projectSchema', () => {
    it('validates a correct project object', () => {
      const validProject = {
        title: 'New Dashboard',
        slug: 'new-dashboard',
        summary: 'A high-performance dashboard for fintech.',
        stack: ['React', 'Supabase'],
        published: true,
      };
      const result = projectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });
  });
});
