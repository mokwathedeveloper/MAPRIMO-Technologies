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
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10">
              <Mic2 className="h-3.5 w-3.5" />
              Podcast Series
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">The MAPRIMO <span className="text-primary italic">Podcast.</span></h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
              Join us as we discuss the latest trends in technology, innovation, and digital transformation with industry experts.
            </p>
          </div>
          <Link href="/podcast">
            <Button variant="outline" size="lg" className="rounded-2xl font-black h-14 px-8 border-2 group shadow-xl shadow-primary/5">
              Listen to All
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {!episodes || episodes.length === 0 ? (
            <div className="text-center py-32 border-4 border-dashed rounded-[3rem] bg-muted/10">
              <Mic2 className="h-20 w-20 text-muted-foreground/10 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-muted-foreground uppercase tracking-widest opacity-40">New episodes in production</h3>
              <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-4 font-medium">
                We're currently preparing insightful conversations for our upcoming episodes.
              </p>
            </div>
          ) : (
            episodes.slice(0, 3).map((episode) => (
              <Card key={episode.id} className="group hover:bg-muted/40 transition-all duration-500 border-none shadow-sm bg-muted/20 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] overflow-hidden flex-shrink-0 relative bg-background shadow-2xl border-4 border-background group-hover:scale-105 transition-transform duration-700">
                      <img 
                        src={episode.cover_url || "/placeholder.svg"} 
                        alt={episode.title}
                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-10 w-10 text-white fill-current" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(episode.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {episode.duration}
                        </span>
                        <span className="text-muted-foreground opacity-50">AUDIO SPEC V1.0</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black group-hover:text-primary transition-colors tracking-tight leading-none">
                        <Link href={`/podcast/${episode.slug}`}>
                          {episode.title}
                        </Link>
                      </h3>
                      <p className="text-lg md:text-xl text-muted-foreground line-clamp-1 font-medium italic opacity-80">
                        "{episode.description}"
                      </p>
                    </div>

                    <div className="flex items-center">
                      <Link href={`/podcast/${episode.slug}`}>
                        <Button size="icon" className="rounded-2xl h-16 w-16 md:h-20 md:w-20 flex-shrink-0 shadow-2xl shadow-primary/30 group-hover:scale-110 transition-all duration-500">
                          <Play className="h-8 w-8 fill-current ml-1" />
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
