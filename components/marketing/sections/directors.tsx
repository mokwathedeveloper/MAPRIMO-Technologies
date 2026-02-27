"use client";

import { Linkedin, Users } from "lucide-react";
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
              <Card key={i} className="overflow-hidden">
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
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground/30" />
            <h2 className="text-3xl font-bold tracking-tight">Meet Our Leadership</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Our board of directors is composed of industry experts committed to driving innovation.
            </p>
            <div className="w-full p-12 border-2 border-dashed rounded-xl bg-background mt-8">
              <p className="text-muted-foreground font-medium">Leadership team information coming soon.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Leadership</h2>
            <p className="text-muted-foreground max-w-[900px] mx-auto">
              Driving the vision of MAPRIMO Technologies.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {directors.map((director) => (
            <Card key={director.id} className="group overflow-hidden bg-background hover:shadow-lg transition-all duration-300 border-none">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={director.image_url || "/placeholder.svg"}
                  alt={director.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold">{director.name}</CardTitle>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {director.role}
                </p>
              </CardHeader>
              <CardContent className="text-center pb-6 px-6">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                  {director.bio}
                </p>
                <div className="flex justify-center gap-2">
                  {director.linkedin_url && (
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600" asChild>
                      <a href={director.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
