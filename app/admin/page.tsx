import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, MessageSquare, Users, Newspaper, Mic2, UserRound } from "lucide-react";

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
      title: "Projects",
      value: projectsCount || 0,
      icon: Briefcase,
      description: "Portfolio items",
      color: "text-blue-600",
    },
    {
      title: "Case Studies",
      value: caseStudiesCount || 0,
      icon: Newspaper,
      description: "Detailed success stories",
      color: "text-orange-600",
    },
    {
      title: "Testimonials",
      value: testimonialsCount || 0,
      icon: MessageSquare,
      description: "Client feedback",
      color: "text-green-600",
    },
    {
      title: "Leads",
      value: leadsCount || 0,
      icon: Users,
      description: "New inquiries",
      color: "text-purple-600",
    },
    {
      title: "Directors",
      value: directorsCount || 0,
      icon: UserRound,
      description: "Leadership team",
      color: "text-rose-600",
    },
    {
      title: "Podcast Episodes",
      value: podcastsCount || 0,
      icon: Mic2,
      description: "Audio content",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here is what is happening with MAPRIMO Technologies.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Activity feed coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
