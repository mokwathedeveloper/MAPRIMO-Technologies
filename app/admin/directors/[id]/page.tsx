import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditDirectorForm } from "@/components/admin/edit-director-form";
import type { Director } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditDirectorPage({ params }: { params: { id: string } }) {
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

  const { data: director } = await supabase
    .from("directors")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!director) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/directors">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Director</h1>
          <p className="text-muted-foreground">Update leadership team member information.</p>
        </div>
      </div>

      <EditDirectorForm director={director as Director} />
    </div>
  );
}
