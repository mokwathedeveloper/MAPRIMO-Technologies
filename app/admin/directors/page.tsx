import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectorList } from "@/components/admin/director-list";
import type { Director } from "@/lib/types";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DirectorsAdminPage() {
  const cookieStore = cookies();
  const supabase = createServerSupabase(cookieStore);
  
  if (!supabase) {
    return null; // Handled by layout redirect
  }
  
  const { data: directors } = await supabase
    .from("directors")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Board of Directors</h1>
          <p className="text-muted-foreground">Manage your leadership team members.</p>
        </div>
        <Link href="/admin/directors/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Director
          </Button>
        </Link>
      </div>

      <DirectorList initialDirectors={(directors || []) as Director[]} />
    </div>
  );
}
