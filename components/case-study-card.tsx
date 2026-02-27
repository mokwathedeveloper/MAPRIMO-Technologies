import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ caseStudy }: { caseStudy: any }) {
  // Supabase might return projects as an object or a single-item array depending on the query
  const project = Array.isArray(caseStudy.projects) 
    ? caseStudy.projects[0] 
    : caseStudy.projects;
  
  if (!project) {
    return (
      <Card className="p-6 border-dashed border-2 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">Case study found, but associated project data is missing.</p>
        <p className="text-[10px] text-muted-foreground/50 mt-2">ID: {caseStudy.id}</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={project.cover_url}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <CardHeader>
        <div className="text-xs text-muted-foreground mb-2">
          Case Study
        </div>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/work/${project.slug}`}>
          <Button variant="outline" size="sm">Read Case Study</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
