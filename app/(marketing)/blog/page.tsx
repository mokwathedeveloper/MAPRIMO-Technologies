import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog | MAPRIMO Technologies",
  description: "Insights on software engineering, QA automation, and building successful MVPs.",
};

export const revalidate = 3600;

async function getPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
    return (data || []) as Post[];
  } catch (e) {
    console.error("Failed to get posts:", e);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="bg-muted/30 py-24 md:py-32 border-b">
        <div className="container max-w-6xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Insights & Engineering
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Deep dives into software architecture, QA automation, and strategies for building products that scale.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group flex flex-col">
                {post.image_url && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="flex-grow">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                    {new Date(post.published_at).toLocaleDateString()} • {post.author}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Read article <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No posts published yet</h3>
              <p className="text-sm text-muted-foreground/60">We're writing our first insights. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
