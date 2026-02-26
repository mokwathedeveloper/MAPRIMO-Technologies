import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { CaseStudyCard } from "@/components/case-study-card";
import { supabase } from "@/lib/supabase";
import type { Project, CaseStudy } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Work | MAPRIMO Technologies",
  description: "Explore our portfolio of successful projects and case studies.",
};

export const revalidate = 3600;

async function getProjects() {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as Project[];
}

async function getCaseStudies() {
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as CaseStudy[];
}

export default async function WorkPage() {
  const [projects, caseStudies] = await Promise.all([getProjects(), getCaseStudies()]);

  return (
    <div className="container py-24">
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Work</h1>
        <p className="text-xl text-muted-foreground">
          Real projects. Real results. See how we help startups and SMEs ship faster.
        </p>
      </div>

      {caseStudies.length > 0 && (
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">Case Studies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && caseStudies.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No projects available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
