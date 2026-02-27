import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  if (!caseStudy) return null;

  return (
    <Card className="overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] transition-all duration-700 border-none bg-muted/20 hover:bg-muted/40 group flex flex-col rounded-[2.5rem] relative">
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        {caseStudy.cover_url ? (
          <Image
            src={caseStudy.cover_url}
            alt={caseStudy.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground/20 font-black text-4xl uppercase tracking-tighter">
            MAPRIMO
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
        
        {/* Client badge overlay */}
        <div className="absolute top-6 left-6 px-3 py-1 bg-background/80 backdrop-blur-md rounded-lg border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
          CLIENT // {caseStudy.client}
        </div>
      </div>
      <CardHeader className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            Case Study
          </div>
        </div>
        <CardTitle className="text-3xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors leading-[1.1] break-words">
          {caseStudy.title}
        </CardTitle>
        <CardDescription className="text-lg font-medium line-clamp-2 leading-relaxed opacity-80 break-words">
          {caseStudy.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 md:px-10 pb-10 pt-0 mt-auto">
        <div className="h-px w-full bg-foreground/5 mb-8" />
        <Link href={`/work/${caseStudy.slug}`} className="group/btn">
          <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-2 group-hover/btn:bg-primary group-hover/btn:text-primary-foreground group-hover/btn:border-primary transition-all duration-500 gap-3">
            Exploration Report
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
