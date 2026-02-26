import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const project = caseStudy.projects;
  
  if (!project) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={project.cover_url}
          alt={project.title}
          fill
          className="object-cover"
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
