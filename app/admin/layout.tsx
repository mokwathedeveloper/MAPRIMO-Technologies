import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Users, 
  ExternalLink,
  Newspaper,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-background">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <LayoutDashboard className="h-6 w-6" />
            <span>Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <Briefcase className="h-4 w-4" />
            <span>Projects</span>
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <Newspaper className="h-4 w-4" />
            <span>Blog</span>
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>Testimonials</span>
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <Users className="h-4 w-4" />
            <span>Leads</span>
          </Link>
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span>View Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
