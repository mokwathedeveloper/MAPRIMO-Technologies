"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import type { Project } from "@/lib/types";

export function ProjectList({ initialProjects }: { initialProjects: Project[] }) {
  const [optimisticProjects, removeOptimisticProject] = useOptimistic(
    initialProjects,
    (state, id: string) => state.filter((p) => p.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticProject(id);
    });
  };

  return (
    <div className="grid gap-6">
      {optimisticProjects.length > 0 ? (
        optimisticProjects.map((project: Project) => (
          <Card key={project.id} className="group overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {project.cover_url && (
                <div className="md:w-48 h-32 relative flex-shrink-0">
                  <img 
                    src={project.cover_url} 
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        project.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {project.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/projects/${project.id}`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteProjectButton 
                      id={project.id} 
                      title={project.title} 
                      onDelete={handleDelete}
                    />
                    <Link href={`/work/${project.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" title="View Live">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.stack.map(s => (
                      <span key={s} className="text-[10px] bg-muted px-2 py-1 rounded border leading-none">{s}</span>
                    ))}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
          <CardTitle className="text-muted-foreground">No projects yet</CardTitle>
          <p className="text-sm text-muted-foreground/60 mt-2">Add your first portfolio item to get started.</p>
        </div>
      )}
    </div>
  );
}
