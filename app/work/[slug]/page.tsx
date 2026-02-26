import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { CaseStudy } from "@/lib/types";

export const revalidate = 3600;

async function getCaseStudy(slug: string) {
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .single();
  
  return data as CaseStudy | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const caseStudy = await getCaseStudy(params.slug);
  
  if (!caseStudy) return {};

  return {
    title: `${caseStudy.title} | Case Study`,
    description: caseStudy.description,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      images: [{ url: caseStudy.image_url }],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await getCaseStudy(params.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="container py-24">
      <Link href="/work">
        <Button variant="ghost" className="mb-8">
          ← Back to Work
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="text-sm font-medium text-primary mb-2">
            {caseStudy.client} • {caseStudy.industry}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{caseStudy.title}</h1>
          <p className="text-xl text-muted-foreground">{caseStudy.description}</p>
        </div>

        <div className="relative h-[400px] w-full mb-16 rounded-xl overflow-hidden">
          <Image
            src={caseStudy.image_url}
            alt={caseStudy.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
              <p className="text-lg leading-relaxed">{caseStudy.challenge}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
              <p className="text-lg leading-relaxed">{caseStudy.solution}</p>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-bold mb-4">Key Results</h3>
              <ul className="space-y-3">
                {caseStudy.results.map((result, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold">✓</span>
                    {result}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
              <h3 className="font-bold mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-background border px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for results like these?</h2>
          <Link href="/contact">
            <Button size="lg">Let&apos;s Talk Project</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
