export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  tags: string[];
  created_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  image_url: string;
  tags: string[];
  created_at: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url?: string;
  created_at: string;
}
