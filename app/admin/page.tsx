import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  MessageSquare, 
  Users, 
  Newspaper, 
  Mic2, 
  UserRound, 
  ArrowUpRight,
  PlusCircle,
  FileText,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const supabase = createServerSupabase(cookieStore);

  if (!supabase) {
    return (
      <div className="p-8 border-4 border-destructive/20 rounded-[2.5rem] bg-destructive/5 text-center space-y-4">
        <h1 className="text-2xl font-black uppercase text-destructive">Configuration Error</h1>
        <p className="text-muted-foreground font-medium">
          Supabase environment variables are missing. Please check your deployment settings.
        </p>
      </div>
    );
  }
  
  // Fetch stats in parallel
  const [
    { count: projectsCount },
    { count: caseStudiesCount },
    { count: testimonialsCount },
    { count: leadsCount },
    { count: directorsCount },
    { count: podcastsCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: 'exact', head: true }),
    supabase.from("case_studies").select("*", { count: 'exact', head: true }),
    supabase.from("testimonials").select("*", { count: 'exact', head: true }),
    supabase.from("leads").select("*", { count: 'exact', head: true }),
    supabase.from("directors").select("*", { count: 'exact', head: true }),
    supabase.from("podcasts").select("*", { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      title: "Active Projects",
      value: projectsCount || 0,
      icon: Briefcase,
      color: "bg-blue-500",
      link: "/admin/projects"
    },
    {
      title: "Case Studies",
      value: caseStudiesCount || 0,
      icon: FileText,
      color: "bg-orange-500",
      link: "/admin/case-studies"
    },
    {
      title: "New Leads",
      value: leadsCount || 0,
      icon: Users,
      color: "bg-purple-500",
      link: "/admin/leads"
    },
    {
      title: "Blog Posts",
      value: (await supabase.from("posts").select("*", { count: 'exact', head: true })).count || 0,
      icon: Newspaper,
      color: "bg-emerald-500",
      link: "/admin/blog"
    },
    {
      title: "Directors",
      value: directorsCount || 0,
      icon: UserRound,
      color: "bg-rose-500",
      link: "/admin/directors"
    },
    {
      title: "Podcasts",
      value: podcastsCount || 0,
      icon: Mic2,
      color: "bg-amber-500",
      link: "/admin/podcasts"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">Dashboard</h1>
          <p className="text-muted-foreground font-medium">Welcome to the MAPRIMO control center.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline" className="rounded-xl font-bold gap-2">
              Live Site <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-background group overflow-hidden relative">
              <div className={stat.color + " absolute inset-y-0 left-0 w-1 opacity-20 group-hover:w-2 transition-all"} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={stat.color + " p-2 rounded-lg text-white shadow-lg"}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                  Total Managed Items
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-[2.5rem] border-4 border-muted/20 bg-muted/10 overflow-hidden">
          <CardHeader className="p-8 border-b border-muted">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "New Project", href: "/admin/projects/new", icon: Briefcase },
                { label: "New Case Study", href: "/admin/case-studies/new", icon: FileText },
                { label: "New Blog Post", href: "/admin/blog/new", icon: Newspaper },
                { label: "Add Director", href: "/admin/directors/new", icon: UserRound },
                { label: "Add Podcast", href: "/admin/podcasts/new", icon: Mic2 },
                { label: "View Leads", href: "/admin/leads", icon: Users },
              ].map(action => (
                <Link key={action.label} href={action.href}>
                  <Button variant="outline" className="w-full h-24 flex-col gap-2 rounded-2xl border-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300">
                    <action.icon className="h-6 w-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-4 border-muted/20 bg-background overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <LayoutDashboard size={120} />
          </div>
          <CardHeader className="p-8 border-b border-muted">
            <CardTitle className="text-xl font-black uppercase tracking-tight">System Status</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Storage Utilization</span>
                <span className="text-primary">Healthy</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[35%] rounded-full" />
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Database Connection: Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Auth Service: Operational</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Storage API: Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
