import { supabase } from "@/lib/supabase";
import type { Podcast } from "@/lib/types";
import { Mic2, Search, Calendar, Clock, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const revalidate = 3600;

async function getPodcasts(searchQuery?: string) {
  try {
    let query = supabase
      .from("podcasts")
      .select("*")
      .order("published_at", { ascending: false });

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Podcast[];
  } catch (e) {
    console.error("Error fetching podcasts:", e);
    return [];
  }
}

export default async function PodcastListingPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const podcasts = await getPodcasts(query);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Header */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/10 animate-in fade-in zoom-in duration-700">
              <Mic2 className="h-4 w-4" />
              Audio Specifications
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[0.9] animate-in fade-in slide-in-from-top-8 duration-1000">
              Voices of <br /><span className="text-primary italic">Innovation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in duration-1000 delay-300">
              Technical conversations with the builders, founders, and experts shaping the future of digital product engineering.
            </p>
          </div>

          {/* Search */}
          <form className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search by topic, stack, or guest..."
              className="pl-16 h-16 rounded-[2rem] border-4 border-muted bg-background shadow-2xl shadow-primary/5 focus-visible:ring-primary focus-visible:border-primary text-xl font-medium"
            />
          </form>

          {/* List */}
          <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 pb-20">
            {podcasts.length === 0 ? (
              <div className="text-center py-40 border-4 border-dashed rounded-[4rem] bg-muted/5 backdrop-blur-sm">
                <Mic2 className="h-24 w-24 text-muted-foreground/10 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-muted-foreground uppercase tracking-widest opacity-40">Frequency Silent</h3>
                <p className="text-muted-foreground mt-4 max-w-xs mx-auto font-medium text-lg">
                  {query ? `No transmission found for "${query}". Try resetting the search parameters.` : "The first technical report is currently in production!"}
                </p>
                {query && (
                  <Link href="/podcast">
                    <Button variant="outline" className="mt-10 rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs border-2">
                      Reset Search
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              podcasts.map((episode) => (
                <Link key={episode.id} href={`/podcast/${episode.slug}`} className="block group">
                  <Card className="hover:bg-muted/40 transition-all duration-700 border-none shadow-sm bg-muted/20 overflow-hidden rounded-[3rem] relative">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-10 p-8 md:p-12">
                        <div className="w-full md:w-64 h-64 md:h-48 rounded-[2rem] overflow-hidden flex-shrink-0 bg-background shadow-2xl border-4 border-background group-hover:scale-105 transition-transform duration-1000">
                          <img
                            src={episode.cover_url || "/placeholder.svg"}
                            alt={episode.title}
                            className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 space-y-5 py-2">
                          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                            <span className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(episode.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {episode.duration}
                            </span>
                            <span className="text-muted-foreground opacity-40">AUDIO LOG // 0{podcasts.indexOf(episode) + 1}</span>
                          </div>
                          <h2 className="text-3xl md:text-5xl font-black group-hover:text-primary transition-colors leading-[1.1] tracking-tight break-words">
                            {episode.title}
                          </h2>
                          <p className="text-lg md:text-xl text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-80 italic break-words">
                            "{episode.description}"
                          </p>
                        </div>
                        <div className="hidden lg:flex items-center justify-center px-6">
                          <div className="h-20 w-20 rounded-[2rem] bg-background flex items-center justify-center shadow-2xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-700">
                            <Play className="h-8 w-8 fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
