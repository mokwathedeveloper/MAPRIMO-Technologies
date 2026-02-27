import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { CaseStudy } from "@/lib/types";
import { ArrowLeft, CheckCircle2, Code2, Rocket, Globe, Github } from "lucide-react";

export const revalidate = 3600;

async function getCaseStudy(slug: string) {
  try {
    // We need !inner to filter the case_study by the joined project's slug
    const { data, error } = await supabase
      .from("case_studies")
      .select("*, projects!inner(*)")
      .eq("projects.slug", slug)
      .single();
    
    if (error) {
      console.error("Error fetching case study by slug:", error);
      return null;
    }

    const caseStudy = data as any;
    if (caseStudy && Array.isArray(caseStudy.projects)) {
      caseStudy.projects = caseStudy.projects[0];
    }
    
    return caseStudy;
  } catch (e) {
    console.error("Catch error fetching case study:", e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const caseStudy = await getCaseStudy(params.slug);
  
  if (!caseStudy || !caseStudy.projects) return {};

  return {
    title: `${caseStudy.projects.title} Case Study | MAPRIMO`,
    description: caseStudy.projects.summary,
    openGraph: {
      title: caseStudy.projects.title,
      description: caseStudy.projects.summary,
      images: [{ url: caseStudy.projects.cover_url }],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await getCaseStudy(params.slug);

  if (!caseStudy || !caseStudy.projects) {
    notFound();
  }

  const { projects: project } = caseStudy;

  return (
    <article className="bg-background">
      {/* Hero Header */}
      <header className="relative pt-24 pb-12 md:pt-32 md:pb-20 bg-muted/30 border-b overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        
        <div className="container max-w-6xl relative z-10">
          <Link 
            href="/work" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Portfolio
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-primary shadow-sm">
                Case Study
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.summary}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {project.live_url && (
                  <Link href={project.live_url} target="_blank">
                    <Button className="gap-2">
                      <Globe className="h-4 w-4" />
                      View Live Site
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border bg-muted">
              <Image
                src={project.cover_url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_350px] gap-16 md:gap-24">
          {/* Main Content */}
          <div className="space-y-16">
            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">The Challenge</h2>
              <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
                {caseStudy.problem.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Our Solution</h2>
              <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
                {caseStudy.solution.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            {caseStudy.screenshots && caseStudy.screenshots.length > 0 && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight">Project Visuals</h2>
                <div className="grid gap-8">
                  {caseStudy.screenshots.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border shadow-lg">
                      <Image 
                        src={url} 
                        alt={`Screenshot ${i + 1}`} 
                        fill 
                        className="object-cover" 
                        sizes="(min-width: 1024px) 800px, 100vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-muted/40 p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Key Results
              </h3>
              <ul className="space-y-4">
                {caseStudy.results.map((result: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="text-xs font-bold bg-background border px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl border bg-background shadow-sm space-y-6 text-center">
              <h3 className="text-xl font-bold leading-tight">Ready for similar results?</h3>
              <p className="text-sm text-muted-foreground">
                Let's discuss how we can apply our engineering expertise to your project.
              </p>
              <Link href="/contact" className="block">
                <Button className="w-full font-bold h-12">
                  Start Your Project
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
