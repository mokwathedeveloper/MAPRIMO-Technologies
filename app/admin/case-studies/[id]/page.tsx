import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditCaseStudyForm } from "@/components/admin/edit-case-study-form";
import type { CaseStudy } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCaseStudyPage({ params }: { params: { id: string } }) {
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

  const { data: caseStudy, error: fetchError } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !caseStudy) {
    logger.error("Error fetching case study:", fetchError);
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/case-studies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Case Study</h1>
          <p className="text-muted-foreground">Update the details of this transformation.</p>
        </div>
      </div>

      <EditCaseStudyForm caseStudy={caseStudy as CaseStudy} />
    </div>
  );
}
