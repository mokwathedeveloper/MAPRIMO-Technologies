import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { FileText, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CaseStudy } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  // Join with projects to get the title
  const { data: caseStudies, error } = await supabase
    .from("case_studies")
    .select("*, projects(title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground">Manage your detailed case studies.</p>
        </div>
        <Button className="flex items-center gap-2" disabled>
          New Case Study
        </Button>
      </div>

      <div className="grid gap-6">
        {caseStudies && caseStudies.length > 0 ? (
          caseStudies.map((cs: any) => (
            <Card key={cs.id} className="group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {cs.projects?.title || "Unknown Project"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created on {new Date(cs.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" disabled title="Edit Case Study">
                    <Pencil className="h-4 w-4" />
                  </Button>
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
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Problem</h4>
                    <p className="text-sm line-clamp-2">{cs.problem}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Solution</h4>
                    <p className="text-sm line-clamp-2">{cs.solution}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No case studies yet</h3>
            <p className="text-sm text-muted-foreground/60">Case studies associated with your projects will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
