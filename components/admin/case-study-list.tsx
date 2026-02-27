"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { FileText, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteCaseStudyButton } from "@/components/admin/delete-case-study-button";
import { EmptyState } from "@/components/admin/empty-state";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyList({ initialCaseStudies }: { initialCaseStudies: CaseStudy[] }) {
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
        description="Detail your successes with in-depth case studies to impress potential partners."
        actionLabel="New Case Study"
        actionHref="/admin/case-studies/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticCaseStudies.map((cs: CaseStudy) => (
        <Card key={cs.id} className="group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors break-words">
                {cs.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{cs.client}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{new Date(cs.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/case-studies/${cs.id}`}>
                <Button variant="ghost" size="icon" title="Edit Case Study">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <DeleteCaseStudyButton 
                id={cs.id} 
                title={cs.title} 
                onDelete={handleDelete}
              />
              <Link href={`/work/${cs.slug}`} target="_blank">
                <Button variant="ghost" size="icon" title="View Live">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 break-words">{cs.summary}</p>
            {cs.tags && cs.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cs.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-muted px-2 py-1 rounded border leading-none">{tag}</span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
