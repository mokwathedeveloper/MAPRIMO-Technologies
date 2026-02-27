import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Lead } from "@/lib/types";
import { Users } from "lucide-react";
import { LeadList } from "@/components/admin/lead-list";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
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
  
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8">Error loading leads: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage your incoming project inquiries.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          {leads?.length || 0} Total
        </div>
      </div>

      <LeadList initialLeads={(leads || []) as Lead[]} />
    </div>
  );
}
