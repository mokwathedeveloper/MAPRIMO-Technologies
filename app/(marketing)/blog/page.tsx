import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
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
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <section className="bg-muted/30 pt-32 pb-24 md:pt-40 md:pb-32 border-b">
        <div className="container max-w-6xl text-center space-y-6">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-black text-primary shadow-sm uppercase tracking-widest mb-4">
            Engineering Blog
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-none">
            Insights & <br /><span className="text-primary italic">Engineering.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Deep dives into software architecture, QA automation, and building products that scale.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container max-w-6xl">
          {featuredPost && (
            <div className="mb-24">
              <Link href={`/blog/${featuredPost.slug}`} className="group">
                <div className="grid lg:grid-cols-2 gap-12 items-center bg-muted/20 rounded-[3rem] overflow-hidden border p-8 md:p-12 hover:bg-muted/40 transition-all duration-500">
                  <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      <span className="bg-primary/10 px-3 py-1 rounded-full">Featured Article</span>
                      <span className="text-muted-foreground">{new Date(featuredPost.published_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors break-words">
                      {featuredPost.title}
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed line-clamp-3 font-medium break-words">
                      {featuredPost.excerpt}
                    </p>
                    <div className="pt-4 flex items-center gap-3 font-black text-sm uppercase tracking-widest">
                      Read Full Insight 
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:translate-x-2 transition-transform">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {remainingPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none shadow-sm bg-muted/20 hover:bg-muted/40 group flex flex-col rounded-[2rem]">
                {post.image_url && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>
                )}
                <CardHeader className="flex-grow p-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center justify-between">
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="opacity-50">5 min read</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight break-words">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base font-medium leading-relaxed break-words">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-0 mt-auto">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-xs font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                    Continue Reading <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10">
              <h3 className="text-2xl font-bold text-muted-foreground mb-4">No posts published yet</h3>
              <p className="text-muted-foreground/60 max-w-xs mx-auto">We're curating deep technical insights for you. Check back very soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
