import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Lead } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

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

      <div className="grid gap-6">
        {leads && leads.length > 0 ? (
          leads.map((lead: Lead) => (
            <Card key={lead.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{lead.name}</CardTitle>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""}
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mt-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Contact Details</p>
                    <p className="font-medium">{lead.email}</p>
                    {lead.company && <p className="text-sm text-muted-foreground italic">{lead.company}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Requested Meeting</p>
                    <p className="font-medium">{lead.requested_date ? new Date(lead.requested_date).toLocaleString() : "No time requested"}</p>
                  </div>
                  {lead.budget && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Budget Range</p>
                      <p className="font-medium text-green-600">{lead.budget}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Message</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 p-4 rounded-md italic">
                    "{lead.message}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No leads found yet</h3>
            <p className="text-sm text-muted-foreground/60">When users fill out your contact form, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
