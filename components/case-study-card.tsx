import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  if (!caseStudy) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-primary/20 group">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {caseStudy.cover_url ? (
          <Image
            src={caseStudy.cover_url}
            alt={caseStudy.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground/20 font-black text-4xl uppercase tracking-tighter">
            MAPRIMO
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded">
            Case Study
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{caseStudy.client}</span>
        </div>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{caseStudy.title}</CardTitle>
        <CardDescription className="line-clamp-2">{caseStudy.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/work/${caseStudy.slug}`}>
          <Button variant="outline" size="sm" className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            Read Case Study
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
