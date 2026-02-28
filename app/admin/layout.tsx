import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect("/login?error=misconfigured");
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Final Auth Check: Ensure user is in the admins table
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", session.user.id)
    .single();

  if (!admin) {
    // If authenticated but not an admin, we could redirect to a 403 or just home
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
