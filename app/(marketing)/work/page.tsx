import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { CaseStudyCard } from "@/components/case-study-card";
import { supabase } from "@/lib/supabase";
import type { Project, CaseStudy } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore our portfolio of successful projects and case studies.",
};

export const revalidate = 0;

async function getProjects() {
  console.log("Fetching projects with simple client...");
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching projects:", error);
      throw error;
    }
    console.log(`Successfully fetched ${data?.length || 0} projects`);
    return (data || []) as Project[];
  } catch (e) {
    console.error("Catch error fetching projects:", e);
    return [];
  }
}

async function getCaseStudies() {
  try {
    console.log("Fetching case studies...");
    const { data, error } = await supabase
      .from("case_studies")
      .select("*, projects(*)") // Remove !inner to see if it's a join issue
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching case studies:", error);
      throw error;
    }
    
    // Log sample to see structure
    if (data && data.length > 0) {
      console.log("Case study sample project structure:", typeof data[0].projects, Array.isArray(data[0].projects) ? "array" : "object");
    }
    
    console.log(`Fetched ${data?.length || 0} case studies`);
    return (data || []) as any[];
  } catch (e) {
    console.error("Error fetching case studies:", e);
    return [];
  }
}

export default async function WorkPage() {
  const [projects, caseStudies] = await Promise.all([getProjects(), getCaseStudies()]);

  return (
    <>
      <section className="bg-muted/30 py-24 md:py-32 border-b">
        <div className="container max-w-6xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Real projects. <br /> Real results.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how we help startups and SMEs ship faster without compromising on quality or accumulating technical debt.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl py-24 space-y-32">
        {caseStudies.length > 0 && (
          <section>
            <div className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Deep Dives</h2>
              <h3 className="text-3xl font-bold">Featured Case Studies</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <div className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Portfolio</h2>
              <h3 className="text-3xl font-bold">All Projects</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {projects.length === 0 && caseStudies.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No projects published yet</h3>
            <p className="text-sm text-muted-foreground/60">We're updating our portfolio. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  );
}
