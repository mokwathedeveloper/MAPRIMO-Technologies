import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Target, ShieldCheck, Rocket } from "lucide-react";
import { DirectorsSection } from "@/components/marketing/sections/directors";
import { supabase } from "@/lib/supabase";
import type { Director } from "@/lib/types";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about MAPRIMO Technologies and our mission to help startups ship quality software fast.",
};

async function getDirectors() {
  try {
    const { data } = await supabase
      .from("directors")
      .select("*")
      .order("created_at", { ascending: true });
    return (data || []) as Director[];
  } catch (e) {
    return [];
  }
}

export default async function AboutPage() {
  const directors = await getDirectors();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="container relative z-10 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Built for speed. <br />
              <span className="text-primary">Engineered for quality.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are a specialized software engineering firm focused on helping SMEs and funded startups navigate the complexities of product development without accumulating technical debt.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
                alt="Our philosophy"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Our Philosophy</h2>
              <h3 className="text-3xl md:text-5xl font-bold">Speed and quality are not mutually exclusive.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By embedding QA into the development process from day one, we help our clients ship faster by breaking less. We don't just build features; we build scalable, testable systems that grow with your user base.
              </p>
              <div className="space-y-4">
                {[
                  "Automated testing from sprint one",
                  "Transparent agile processes",
                  "Direct access to senior engineers",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <DirectorsSection directors={directors} />

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Core Values</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Why MAPRIMO?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "QA First Mentality",
                desc: "We don't just write code; we ensure it works at scale through robust automation. Bugs are caught before they reach production."
              },
              {
                icon: Rocket,
                title: "Startup Speed",
                desc: "We understand the pressure of time-to-market. We build with agility in mind, delivering functional iterations weekly."
              },
              {
                icon: Users,
                title: "Radical Transparency",
                desc: "No technical jargon or hidden roadmaps. You get clear communication, regular updates, and absolute visibility into our progress."
              }
            ].map((val, i) => (
              <div key={i} className="p-8 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <val.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold mb-3">{val.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 text-center space-y-8 shadow-xl">
            <Target className="h-16 w-16 mx-auto opacity-80" />
            <h2 className="text-3xl md:text-5xl font-bold">Ready to work together?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              We're always looking for ambitious founders and teams who want to build something exceptional.
            </p>
            <Link href="/contact" className="inline-block">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                Start a Conversation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
