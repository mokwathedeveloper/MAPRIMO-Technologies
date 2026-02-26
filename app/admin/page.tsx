import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Lead } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
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
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Total Leads: {leads?.length || 0}
        </div>
      </div>

      <div className="grid gap-6">
        {leads && leads.length > 0 ? (
          leads.map((lead: Lead) => (
            <Card key={lead.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{lead.name}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""}
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p>{lead.email}</p>
                    {lead.company && <p className="text-sm italic">{lead.company}</p>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Requested Meeting</p>
                    <p>{lead.requested_date ? new Date(lead.requested_date).toLocaleString() : "No time requested"}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Message</p>
                  <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
            No leads found yet.
          </p>
        )}
      </div>
    </div>
  );
}
