"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { FileText, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteCaseStudyButton } from "@/components/admin/delete-case-study-button";
import { EmptyState } from "@/components/admin/empty-state";

export function CaseStudyList({ initialCaseStudies }: { initialCaseStudies: any[] }) {
  const [optimisticCaseStudies, removeOptimisticCaseStudy] = useOptimistic(
    initialCaseStudies,
    (state, id: string) => state.filter((cs) => cs.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticCaseStudy(id);
    });
  };

  if (optimisticCaseStudies.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No case studies yet"
        description="Detail your project successes with in-depth case studies to impress clients."
        actionLabel="New Case Study"
        actionHref="/admin/case-studies/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticCaseStudies.map((cs: any) => (
        <Card key={cs.id} className="group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {cs.projects?.title || "Unknown Project"}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span className="bg-primary/5 text-primary px-2 py-0.5 rounded font-medium border border-primary/10">Case Study</span>
                <span>Created on {new Date(cs.created_at).toLocaleDateString()}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/case-studies/${cs.id}`}>
                <Button variant="ghost" size="icon" title="Edit Case Study">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <DeleteCaseStudyButton 
                id={cs.id} 
                title={cs.projects?.title || "Case Study"} 
                onDelete={handleDelete}
              />
              {cs.projects?.slug && (
                <Link href={`/work/${cs.projects.slug}`} target="_blank">
                  <Button variant="ghost" size="icon" title="View Live">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 grid md:grid-cols-2 gap-6 border-t pt-4">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Problem</h4>
                <p className="text-sm line-clamp-3 leading-relaxed">{cs.problem}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Solution</h4>
                <p className="text-sm line-clamp-3 leading-relaxed">{cs.solution}</p>
              </div>
            </div>
            {cs.results && Array.isArray(cs.results) && cs.results.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {cs.results.slice(0, 3).map((result: string, i: number) => (
                  <span key={i} className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 font-medium italic">
                    ✓ {result}
                  </span>
                ))}
                {cs.results.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{cs.results.length - 3} more results</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
