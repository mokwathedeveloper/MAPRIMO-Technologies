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
    <div className="min-h-screen pt-32 pb-24 bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] animate-in fade-in zoom-in duration-700">
              <Mic2 className="h-4 w-4" />
              Podcast Series
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-top-8 duration-1000">
              Voices of Innovation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-300">
              Conversations with the builders, founders, and technical experts who are shaping the future of digital products.
            </p>
          </div>

          {/* Search */}
          <form className="relative max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search episodes by title or topic..."
              className="pl-12 h-14 rounded-2xl border-primary/10 bg-background shadow-xl shadow-primary/5 focus-visible:ring-primary focus-visible:border-primary text-lg"
            />
          </form>

          {/* List */}
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            {podcasts.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed rounded-[2rem] bg-muted/5">
                <Mic2 className="h-20 w-20 text-muted-foreground/10 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-muted-foreground">No episodes found</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  {query ? `We couldn't find any results for "${query}". Try another search term.` : "The first episode of our podcast is currently in production!"}
                </p>
                {query && (
                  <Link href="/podcast">
                    <Button variant="outline" className="mt-8 rounded-full px-8">
                      View all episodes
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              podcasts.map((episode) => (
                <Link key={episode.id} href={`/podcast/${episode.slug}`} className="block">
                  <Card className="group hover:bg-muted/40 transition-all duration-500 border-none shadow-sm bg-muted/20 overflow-hidden rounded-[2rem]">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row gap-8 p-8">
                        <div className="w-full sm:w-56 h-56 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-muted shadow-lg">
                          <img
                            src={episode.cover_url || "/placeholder.svg"}
                            alt={episode.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 space-y-3 py-1">
                          <div className="flex items-center gap-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                            <span className="flex items-center gap-2 text-primary bg-primary/5 px-2 py-0.5 rounded">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(episode.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              {episode.duration}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors leading-tight">
                            {episode.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-2 leading-relaxed text-base">
                            {episode.description}
                          </p>
                        </div>
                        <div className="hidden lg:flex items-center justify-center px-4">
                          <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center shadow-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                            <Play className="h-6 w-6 fill-current ml-1" />
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
