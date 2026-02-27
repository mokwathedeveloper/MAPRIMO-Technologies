"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Mic2, ExternalLink, Play, Calendar, Clock, Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeletePodcastButton } from "@/components/admin/delete-podcast-button";
import { EmptyState } from "@/components/admin/empty-state";
import type { Podcast } from "@/lib/types";

export function PodcastList({ initialEpisodes }: { initialEpisodes: Podcast[] }) {
  const [optimisticEpisodes, removeOptimisticEpisode] = useOptimistic(
    initialEpisodes,
    (state, id: string) => state.filter((e) => e.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticEpisode(id);
    });
  };

  if (optimisticEpisodes.length === 0) {
    return (
      <EmptyState
        icon={Mic2}
        title="No podcast episodes yet"
        description="Start your audio journey by adding your first podcast episode."
        actionLabel="New Episode"
        actionHref="/admin/podcasts/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticEpisodes.map((episode: Podcast) => (
        <Card key={episode.id} className="group overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {episode.cover_url && (
              <div className="md:w-32 h-32 relative flex-shrink-0">
                <img 
                  src={episode.cover_url} 
                  alt={episode.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {episode.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(episode.published_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {episode.duration}
                    </span>
                    <span>By {episode.author}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/podcasts/${episode.id}`}>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeletePodcastButton 
                    id={episode.id} 
                    title={episode.title} 
                    onDelete={handleDelete}
                  />
                  <Link href={`/podcast/${episode.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View Detail">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{episode.description}</p>
                {episode.audio_url && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
                    <Play className="h-3 w-3 fill-current" />
                    Audio file uploaded
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
