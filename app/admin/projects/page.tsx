import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/admin/project-list";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
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
  
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your company portfolio.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <ProjectList initialProjects={(projects || []) as Project[]} />
    </div>
  );
}
