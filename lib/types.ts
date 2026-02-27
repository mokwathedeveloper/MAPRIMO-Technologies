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
  title: string;
  slug: string;
  summary: string;
  cover_url: string;
  client: string;
  problem: string;
  solution: string;
  results: string[];
  screenshots: string[];
  tags: string[];
  created_at: string;
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

export interface Director {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  linkedin_url?: string;
  twitter_url?: string;
  created_at: string;
}

export interface Podcast {
  id: string;
  title: string;
  slug: string;
  description: string;
  audio_url: string;
  cover_url: string;
  duration: string;
  author: string;
  published_at: string;
  created_at: string;
}
