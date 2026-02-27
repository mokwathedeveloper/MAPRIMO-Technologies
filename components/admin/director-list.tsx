"use client";

import { useOptimistic, useTransition } from "react";
import { Users, Linkedin, Twitter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteDirectorButton } from "@/components/admin/delete-director-button";
import { EmptyState } from "@/components/admin/empty-state";
import type { Director } from "@/lib/types";

export function DirectorList({ initialDirectors }: { initialDirectors: Director[] }) {
  const [optimisticDirectors, removeOptimisticDirector] = useOptimistic(
    initialDirectors,
    (state, id: string) => state.filter((d) => d.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticDirector(id);
    });
  };

  if (optimisticDirectors.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No directors yet"
        description="Add members to your leadership team to showcase the expertise behind MAPRIMO."
        actionLabel="New Director"
        actionHref="/admin/directors/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticDirectors.map((director: Director) => (
        <Card key={director.id} className="group overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {director.image_url && (
              <div className="md:w-48 h-48 relative flex-shrink-0">
                <img 
                  src={director.image_url} 
                  alt={director.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {director.name}
                  </CardTitle>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider mt-1">
                    {director.role}
                  </p>
                </div>
                <div className="flex gap-2">
                  <DeleteDirectorButton 
                    id={director.id} 
                    name={director.name} 
                    onDelete={handleDelete}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{director.bio}</p>
                <div className="flex gap-4 mt-4">
                  {director.linkedin_url && (
                    <a href={director.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {director.twitter_url && (
                    <a href={director.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-sky-500 transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
