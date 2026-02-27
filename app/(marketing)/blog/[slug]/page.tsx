import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

async function getPost(slug: string) {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();
  
  return data as Post | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container py-24">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8">
          ← Back to Blog
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <div className="text-sm text-primary font-medium mb-4">
            {new Date(post.published_at).toLocaleDateString()} • {post.author}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <p className="text-xl text-muted-foreground italic">{post.excerpt}</p>
        </header>

        {post.image_url && (
          <div className="relative h-[400px] w-full mb-12 rounded-xl overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-24 p-8 bg-muted rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">Enjoying our content?</h3>
          <p className="text-muted-foreground mb-8">
            We help startups build and scale quality products. Let's talk about yours.
          </p>
          <Link href="/contact">
            <Button size="lg">Get in Touch</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
