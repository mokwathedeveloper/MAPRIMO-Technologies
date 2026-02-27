export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  cover_url: string;
  live_url?: string;
  highlights: any[];
  published: boolean;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  project_id: string;
  problem: string;
  solution: string;
  results: any[];
  screenshots: string[];
  created_at: string;
  projects?: Project;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  budget?: string;
  source?: string;
  requested_date?: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  created_at: string;
}

export interface Admin {
  user_id: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  tags: string[];
  published_at: string;
  created_at: string;
}
