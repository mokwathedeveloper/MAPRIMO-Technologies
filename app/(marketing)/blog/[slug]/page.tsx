import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from "lucide-react";

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

async function getNextPost(currentId: string) {
  try {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, image_url, published_at, author")
      .neq("id", currentId)
      .limit(1)
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

  const nextPost = await getNextPost(post.id);

  return (
    <article className="bg-background">
      {/* Article Header */}
      <header className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-muted/30 border-b overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="container max-w-4xl relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Insights
          </Link>
          
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {post.author}
              </div>
              <div className="text-muted-foreground opacity-50">ENGINEERING REPORT // V1.0</div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 break-words">
              {post.title}
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed max-w-3xl font-medium break-words">
              {post.excerpt}
            </p>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl py-16 md:py-32">
        {/* Featured Image */}
        {post.image_url && (
          <div className="relative aspect-video w-full mb-20 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border-8 border-muted/20 bg-muted group">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(min-width: 1024px) 896px, 100vw"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px] gap-12 lg:gap-24">
          <div className="prose prose-lg md:prose-2xl dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-a:text-primary prose-img:rounded-[2rem] max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-muted-foreground/90">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          
          {/* Side Toolbar (Sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-32 space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Distribute</p>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:border-primary">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Categorization</p>
                  <div className="flex flex-col gap-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors cursor-pointer flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Post Section */}
        {nextPost && (
          <div className="mt-32 pt-20 border-t border-muted/30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">Continuous Intelligence</p>
            <Link href={`/blog/${nextPost.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-10 items-center p-8 md:p-12 rounded-[3rem] bg-muted/20 hover:bg-muted/40 transition-all duration-500 border-2 border-transparent hover:border-primary/10">
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl">
                  <Image 
                    src={nextPost.image_url} 
                    alt={nextPost.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] opacity-50">Next Article</h4>
                  <h3 className="text-3xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{nextPost.title}</h3>
                  <p className="text-muted-foreground font-medium line-clamp-2">{nextPost.excerpt}</p>
                  <div className="pt-4 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                    Load Insight
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground group-hover:translate-x-2 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Final CTA */}
        <div className="mt-32">
          <div className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-[60px]" />
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none relative z-10">Architect your <br /><span className="italic opacity-80">next breakthrough.</span></h3>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-medium leading-relaxed relative z-10">
              Our engineering team specializes in helping startups build quality products fast. Let&apos;s discuss your technical roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 relative z-10">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl transition-all hover:scale-[1.02]">
                  Get In Touch
                </Button>
              </Link>
              <Link href="/work">
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-black rounded-2xl border-primary-foreground/20 hover:bg-white/10">
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
