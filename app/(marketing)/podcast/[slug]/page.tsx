import { supabase } from "@/lib/supabase";
import type { Podcast } from "@/lib/types";
import { Mic2, Calendar, Clock, ArrowLeft, Play, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

async function getPodcast(slug: string) {
  try {
    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data as Podcast;
  } catch (e) {
    console.error("Error fetching podcast episode:", e);
    return null;
  }
}

function getYoutubeEmbedUrl(url: string | null | undefined) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default async function PodcastDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const episode = await getPodcast(params.slug);

  if (!episode) {
    notFound();
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(episode.youtube_url);

  return (
    <div className="min-h-screen pt-40 pb-24 bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Back button */}
          <Link href="/podcast" className="group">
            <Button variant="ghost" className="gap-3 -ml-4 text-muted-foreground hover:text-primary hover:bg-transparent text-lg font-bold">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Back to episodes
            </Button>
          </Link>

          {/* Episode Header */}
          <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
            <div className="w-full lg:w-[400px] aspect-square rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl flex-shrink-0 border-4 border-background animate-in fade-in slide-in-from-left-8 duration-1000">
              <img
                src={episode.cover_url || "/placeholder.svg"}
                alt={episode.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 space-y-8 py-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="flex flex-wrap items-center gap-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2.5 text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/5">
                  <Calendar className="h-4 w-4" />
                  {new Date(episode.published_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2.5 bg-muted/50 px-4 py-1.5 rounded-full border">
                  <Clock className="h-4 w-4" />
                  {episode.duration}
                </span>
                <span className="flex items-center gap-2.5 bg-muted/50 px-4 py-1.5 rounded-full border">
                  <User className="h-4 w-4" />
                  By {episode.author || "MAPRIMO Team"}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                {episode.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {episode.description}
              </p>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Button className="h-16 px-10 rounded-full text-xl font-black gap-4 shadow-2xl shadow-primary/30 transition-all hover:scale-105">
                  <Play className="h-6 w-6 fill-current" />
                  {episode.video_url || episode.youtube_url ? "Watch Episode" : "Play Episode"}
                </Button>
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-muted/20 hover:bg-muted/10 transition-colors">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Media Player Section */}
          <div className="p-1 rounded-[3rem] bg-muted/20 border border-primary/5 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 shadow-2xl">
            <div className="bg-background/40 backdrop-blur-md p-8 md:p-12 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Mic2 className="h-6 w-6 text-primary" />
                  Episode Media
                </h2>
              </div>

              {/* YouTube Embed Prioritized */}
              {youtubeEmbedUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                  <iframe
                    src={youtubeEmbedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : episode.video_url ? (
                /* Local Video Second */
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-background bg-black">
                  <video controls className="w-full h-full">
                    <source src={episode.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : episode.audio_url ? (
                /* Audio Only Fallback */
                <div className="bg-background/80 backdrop-blur-sm p-8 rounded-3xl border shadow-inner">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-pulse">
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase tracking-widest text-primary mb-2">Now Streaming Audio</p>
                      <audio controls className="w-full h-12">
                        <source src={episode.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-background/50 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/10 space-y-3">
                  <p className="text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">Media Synchronization Pending</p>
                  <p className="text-xs text-muted-foreground/60 font-medium">The technical report will be available across all streams shortly.</p>
                </div>
              )}
            </div>
          </div>

          {/* Content / Show Notes */}
          <div className="prose prose-lg dark:prose-invert max-w-none pt-12 border-t border-muted/20 animate-in fade-in duration-1000 delay-700">
             <h3 className="text-2xl font-black mb-6">Show Notes</h3>
             <p className="text-muted-foreground leading-relaxed text-lg">
               Detailed show notes, key takeaways, and a full transcript for this episode are being curated by our editorial team. 
               Check back shortly for the complete breakdown of our conversation on {episode.title}.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
