"use client";

import Link from "next/link";
import { Play, Calendar, Clock, Mic2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Podcast } from "@/lib/types";

interface PodcastSectionProps {
  episodes: Podcast[];
}

export function PodcastSection({ episodes }: PodcastSectionProps) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The MAPRIMO Podcast</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Join us as we discuss the latest trends in technology, innovation, and digital transformation.
            </p>
          </div>
          <Link href="/podcast">
            <Button variant="outline" className="gap-2">
              View All Episodes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {!episodes || episodes.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/10">
              <Mic2 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">New episodes coming soon!</h3>
              <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-2">
                We're currently preparing insightful conversations for our upcoming episodes. Stay tuned!
              </p>
            </div>
          ) : (
            episodes.slice(0, 3).map((episode) => (
              <Card key={episode.id} className="group hover:bg-muted/40 transition-all duration-300 border-none shadow-none bg-muted/20">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
                    <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 relative bg-muted">
                      <img 
                        src={episode.cover_url || "/placeholder.svg"} 
                        alt={episode.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-8 w-8 text-white fill-current" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(episode.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {episode.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        <Link href={`/podcast/${episode.slug}`}>
                          {episode.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {episode.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/podcast/${episode.slug}`}>
                        <Button size="icon" variant="default" className="rounded-full h-12 w-12 flex-shrink-0 shadow-lg shadow-primary/20">
                          <Play className="h-5 w-5 fill-current ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
