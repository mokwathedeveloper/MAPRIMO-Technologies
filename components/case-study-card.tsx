import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={caseStudy.image_url}
          alt={caseStudy.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="text-xs text-muted-foreground mb-2">
          {caseStudy.client} • {caseStudy.industry}
        </div>
        <CardTitle>{caseStudy.title}</CardTitle>
        <CardDescription>{caseStudy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/work/${caseStudy.slug}`}>
          <Button variant="outline" size="sm">Read Case Study</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
