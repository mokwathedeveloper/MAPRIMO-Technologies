import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maprimo.com";

  let caseStudyUrls: any[] = [];
  let blogPostUrls: any[] = [];

  try {
    // Fetch all case study slugs for dynamic routes
    const { data: caseStudies } = await supabase
      .from("case_studies")
      .select("slug, created_at");

    const { data: posts } = await supabase
      .from("posts")
      .select("slug, published_at, created_at");

    caseStudyUrls = (caseStudies || []).map((cs) => ({
      url: `${baseUrl}/work/${cs.slug}`,
      lastModified: new Date(cs.created_at),
    }));

    blogPostUrls = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at),
    }));
  } catch (err) {
    console.warn("Failed to fetch dynamic routes for sitemap. Using static routes only.");
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseStudyUrls,
    ...blogPostUrls,
  ];
}
