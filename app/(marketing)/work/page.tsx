import { logger } from "@/lib/logger";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { CaseStudyCard } from "@/components/case-study-card";
import { supabase } from "@/lib/supabase";
import type { Project, CaseStudy } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore our portfolio of successful projects and case studies.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProjects() {
  logger.info("Fetching projects with simple client...");
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    
    if (error) {
      logger.error("Supabase error fetching projects:", error);
      throw error;
    }
    logger.info(`Successfully fetched ${data?.length || 0} projects`);
    return (data || []) as Project[];
  } catch (e) {
    logger.error("Catch error fetching projects:", e);
    return [];
  }
}

async function getCaseStudies() {
  try {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase error fetching case studies:", error);
      throw error;
    }
    
    return (data || []) as CaseStudy[];
  } catch (e) {
    logger.error("Error fetching case studies:", e);
    return [];
  }
}

export default async function WorkPage() {
  const [projects, caseStudies] = await Promise.all([getProjects(), getCaseStudies()]);

  return (
    <>
      <section className="bg-muted/30 pt-32 pb-24 md:pt-40 md:pb-32 border-b relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="container max-w-6xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-[10px] font-black text-primary shadow-sm uppercase tracking-[0.2em] mb-4">
            Our Portfolio
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[0.9]">
            Real projects. <br /> <span className="text-primary italic">Real results.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            See how we help startups and SMEs ship faster without compromising on quality or accumulating technical debt.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl py-24 space-y-32">
        {caseStudies.length > 0 && (
          <section>
            <div className="mb-16 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Deep Dives</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tight">Featured Case Studies</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <div className="mb-16 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Portfolio</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tight">All Projects</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {projects.length === 0 && caseStudies.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10">
            <h3 className="text-2xl font-bold text-muted-foreground mb-4">No projects published yet</h3>
            <p className="text-muted-foreground/60 max-w-xs mx-auto">We&apos;re currently documenting our latest engineering successes. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  );
}
