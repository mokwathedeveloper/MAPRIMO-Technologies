import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types";
import { Globe, Code2 } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none shadow-sm bg-muted/20 hover:bg-muted/40 group flex flex-col rounded-[2rem]">
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full opacity-10">
            <Code2 className="w-20 h-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        {project.live_url && (
          <a 
            href={project.live_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-lg"
          >
            <Globe className="h-5 w-5" />
          </a>
        )}
      </div>
      <CardHeader className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full">
            Project
          </div>
        </div>
        <CardTitle className="text-2xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors leading-none">
          {project.title}
        </CardTitle>
        <CardDescription className="text-base font-medium line-clamp-2 leading-relaxed">
          {project.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-background border px-2 py-1 rounded-md shadow-sm">
              {tag}
            </span>
          ))}
          {project.stack.length > 3 && (
            <span className="text-[10px] font-bold text-muted-foreground pt-1">+{project.stack.length - 3} more</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
