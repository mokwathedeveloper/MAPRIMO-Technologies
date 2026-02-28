import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Users, Target, ShieldCheck, Rocket } from "lucide-react";
import { DirectorsSection } from "@/components/marketing/sections/directors";
import { supabase } from "@/lib/supabase";
import type { Director } from "@/lib/types";

export const dynamic = "force-dynamic";
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
      <section className="relative overflow-hidden bg-background pt-32 pb-24 md:pt-40 md:pb-32 border-b">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>
        <div className="container relative z-10 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-[10px] font-black text-primary shadow-sm uppercase tracking-[0.2em] mb-4">
              Our Mission
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[0.9] font-heading">
              Built for speed. <br />
              <span className="text-primary italic">Engineered for quality.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium max-w-3xl mx-auto">
              We are a specialized software engineering firm focused on helping SMEs and funded startups navigate the complexities of product development without accumulating technical debt.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border-8 border-muted/20">
              <Image 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
                alt="Our philosophy"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Our Philosophy</h2>
                <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-tight font-heading">Speed and quality are not mutually exclusive.</h3>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                By embedding QA into the development process from day one, we help our clients ship faster by breaking less. We don&apos;t just build features; we build scalable, testable systems that grow with your user base.
              </p>
              <div className="grid gap-6">
                {[
                  "Automated testing from sprint one",
                  "Transparent agile processes",
                  "Direct access to senior engineers",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 group">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground/80">{item}</span>
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
      <section className="py-24 md:py-32 bg-muted/20 border-y">
        <div className="container max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Core Values</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight font-heading">Why MAPRIMO?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: ShieldCheck,
                title: "QA First Mentality",
                desc: "We don&apos;t just write code; we ensure it works at scale through robust automation. Bugs are caught before they reach production."
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
              <Card key={i} className="p-10 rounded-[2.5rem] border-none shadow-sm bg-background hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <val.icon className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-black mb-4 tracking-tight">{val.title}</h4>
                <p className="text-muted-foreground leading-relaxed font-medium text-lg">{val.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 mb-16">
        <div className="container max-w-5xl">
          <div className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-[60px]" />
            <Target className="h-20 w-20 mx-auto opacity-50 transition-transform duration-700 group-hover:scale-110" />
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none font-heading">Ready to work together?</h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
                We&apos;re always looking for ambitious founders and teams who want to build something exceptional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4 relative z-10">
              <Link href="/contact" className="inline-block">
                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl transition-all hover:scale-[1.02]">
                  Start a Conversation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
