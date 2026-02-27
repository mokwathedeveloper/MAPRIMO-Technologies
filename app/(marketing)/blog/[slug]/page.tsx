import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

export const revalidate = 3600;

async function getPost(slug: string) {
  try {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single();
    
    return data as Post | null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | MAPRIMO Blog`,
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
    <article className="bg-background">
      {/* Article Header */}
      <header className="relative pt-24 pb-12 md:pt-32 md:pb-20 bg-muted/30 border-b">
        <div className="container max-w-4xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Insights
          </Link>
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {post.author}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl border-l-4 border-primary pl-6 py-2 italic bg-background/50 rounded-r-lg">
              {post.excerpt}
            </p>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl py-16 md:py-24">
        {/* Featured Image */}
        {post.image_url && (
          <div className="relative aspect-video w-full mb-16 rounded-2xl overflow-hidden shadow-2xl border bg-muted">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px] gap-12">
          <div className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          
          {/* Side Toolbar (Sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Share</p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topics</p>
                <div className="flex flex-col gap-2">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="text-xs font-medium text-primary hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-24 pt-12 border-t border-border/50">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl">
            <h3 className="text-3xl font-bold">Have a project in mind?</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Our engineering team specializes in helping startups build quality products fast. Let's discuss your technical roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="h-12 px-8 font-bold">
                  Get in Touch
                </Button>
              </Link>
              <Link href="/work">
                <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/20 hover:bg-white/10">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
