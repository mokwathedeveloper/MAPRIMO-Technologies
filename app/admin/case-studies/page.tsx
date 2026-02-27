import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyList } from "@/components/admin/case-study-list";
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
  
  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground">Manage your detailed transformation stories.</p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Case Study
          </Button>
        </Link>
      </div>

      <CaseStudyList initialCaseStudies={(caseStudies || []) as CaseStudy[]} />
    </div>
  );
}
