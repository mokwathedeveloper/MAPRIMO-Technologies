"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { MessageSquare, Quote, Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteTestimonialButton } from "@/components/admin/delete-testimonial-button";
import { EmptyState } from "@/components/admin/empty-state";
import type { Testimonial } from "@/lib/types";

export function TestimonialList({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [optimisticTestimonials, removeOptimisticTestimonial] = useOptimistic(
    initialTestimonials,
    (state, id: string) => state.filter((t) => t.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticTestimonial(id);
    });
  };

  if (optimisticTestimonials.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No testimonials yet"
        description="Client feedback will appear here. Add your first one to build trust."
        actionLabel="New Testimonial"
        actionHref="/admin/testimonials/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticTestimonials.map((t: Testimonial) => (
        <Card key={t.id} className="relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/10">
                {t.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight">{t.name}</CardTitle>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{t.role} at {t.company}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/testimonials/${t.id}`}>
                <Button variant="ghost" size="icon" title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <DeleteTestimonialButton id={t.id!} name={t.name} onDelete={handleDelete} />
            </div>
          </CardHeader>
          <CardContent className="relative pt-4 border-t border-muted/50">
            <Quote className="absolute -top-1 -left-1 h-8 w-8 text-primary/5 -rotate-12" />
            <p className="text-base leading-relaxed italic bg-muted/20 p-6 rounded-2xl border-l-4 border-primary/20 break-words font-medium">
              "{t.quote}"
            </p>
            <p className="text-[10px] font-bold text-muted-foreground mt-4 uppercase tracking-widest opacity-50">
              LOGGED ON // {new Date(t.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
