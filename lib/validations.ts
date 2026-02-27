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
  cover_url: z.string().url("Invalid cover image URL").optional().or(z.literal("")),
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
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  client: z.string().min(2, "Client name must be at least 2 characters"),
  problem: z.string().min(20, "Problem description must be at least 20 characters"),
  solution: z.string().min(20, "Solution description must be at least 20 characters"),
  results: z.array(z.string()).min(1, "At least one result point is required"),
  tags: z.array(z.string()).optional().default([]),
  cover_url: z.string().url("Invalid cover image URL").optional().or(z.literal("")),
});

export type CaseStudyFormData = z.infer<typeof caseStudySchema>;

export const directorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
});

export type DirectorFormData = z.infer<typeof directorSchema>;

export const podcastSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  audio_url: z.string().url("Invalid audio URL").optional().or(z.literal("")),
  cover_url: z.string().url("Invalid cover URL").optional().or(z.literal("")),
  duration: z.string().min(1, "Duration is required"),
  author: z.string().min(2, "Author must be at least 2 characters"),
});

export type PodcastFormData = z.infer<typeof podcastSchema>;


