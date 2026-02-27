"use client";

import { Linkedin, Users, UserRound, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Director } from "@/lib/types";

interface DirectorsSectionProps {
  directors: Director[];
  isLoading?: boolean;
}

export function DirectorsSection({ directors, isLoading }: DirectorsSectionProps) {
  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-[2.5rem]">
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!directors || directors.length === 0) {
    return (
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <UserRound className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Meet Our Leadership</h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto font-medium">
              Our board of directors is composed of industry experts committed to driving innovation.
            </p>
            <div className="w-full p-20 border-4 border-dashed rounded-[3rem] bg-background/50 mt-12 backdrop-blur-sm">
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">Engineering Council // Deploying Soon</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden border-y">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-black text-primary shadow-sm uppercase tracking-[0.3em]">
              Board of Directors
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">Meet Our <span className="text-primary italic">Leadership.</span></h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[900px] mx-auto font-medium leading-relaxed">
              Driving the vision and technical excellence of MAPRIMO Technologies.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {directors.map((director) => (
            <Card key={director.id} className="group overflow-hidden bg-background hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] transition-all duration-700 border-none rounded-[3rem] relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={director.image_url || "/placeholder.svg"}
                  alt={director.name}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />
                
                {/* ID Tag overlay */}
                <div className="absolute top-6 right-6 px-3 py-1 bg-background/80 backdrop-blur-md rounded-lg border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
                  STAFF ID // {director.id.substring(0, 8)}
                </div>
              </div>
              <CardHeader className="text-center pb-2 pt-8 relative z-10 px-8">
                <CardTitle className="text-3xl font-black tracking-tight leading-none mb-2">{director.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-4 bg-primary/30" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                    {director.role}
                  </p>
                  <div className="h-px w-4 bg-primary/30" />
                </div>
              </CardHeader>
              <CardContent className="text-center pb-10 px-10 relative z-10">
                <p className="text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed">
                  {director.bio}
                </p>
                <div className="flex justify-center items-center gap-4">
                  <div className="h-px flex-1 bg-foreground/5" />
                  {director.linkedin_url && (
                    <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 border border-transparent hover:border-blue-100 shadow-none" asChild>
                      <a href={director.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  <div className="h-px flex-1 bg-foreground/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
