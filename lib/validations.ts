import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  requested_date: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  stack: z.array(z.string()).min(1, "At least one tech stack item required"),
  cover_url: z.string().optional().or(z.literal("")),
  repo_url: z.string().url("Invalid repository URL").optional().or(z.literal("")),
  live_url: z.string().url("Invalid live site URL").optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  quote: z.string().min(10, "Quote must be at least 10 characters"),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const caseStudySchema = z.object({
  project_id: z.string().uuid("Invalid project selected"),
  problem: z.string().min(20, "Problem description must be at least 20 characters"),
  solution: z.string().min(20, "Solution description must be at least 20 characters"),
  results: z.array(z.string()).min(1, "At least one result point is required"),
});

export type CaseStudyFormData = z.infer<typeof caseStudySchema>;


