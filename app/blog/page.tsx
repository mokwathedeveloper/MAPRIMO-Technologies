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
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  return (data || []) as Post[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container py-24">
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-bold mb-4">Blog & Insights</h1>
        <p className="text-xl text-muted-foreground">
          Deep dives into software engineering, QA automation, and product strategy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {post.image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="text-xs text-muted-foreground mb-2">
                {new Date(post.published_at).toLocaleDateString()} • {post.author}
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/blog/${post.slug}`}>
                <Button variant="outline" size="sm">Read More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center py-24 text-muted-foreground border rounded-lg bg-muted/20">
          No posts published yet. Stay tuned!
        </p>
      )}
    </div>
  );
}
