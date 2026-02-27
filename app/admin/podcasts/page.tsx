import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Plus, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PodcastList } from "@/components/admin/podcast-list";
import type { Podcast } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PodcastsAdminPage() {
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
  
  const { data: episodes } = await supabase
    .from("podcasts")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Podcast Episodes</h1>
          <p className="text-muted-foreground">Manage your audio content and show notes.</p>
        </div>
        <Link href="/admin/podcasts/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Episode
          </Button>
        </Link>
      </div>

      <PodcastList initialEpisodes={(episodes || []) as Podcast[]} />
    </div>
  );
}
