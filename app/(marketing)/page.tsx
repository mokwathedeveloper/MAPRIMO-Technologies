import { logger } from "@/lib/logger";
import Link from "next/link";
import Image from "next/image";
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  Search, 
  Code2, 
  Bug, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  Boxes,
  Microscope,
  Activity,
  Cpu,
  Layers,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudyCard } from "@/components/case-study-card";
import { AccordionItem } from "@/components/ui/accordion";
import { DirectorsSection } from "@/components/marketing/sections/directors";
import { PodcastSection } from "@/components/marketing/sections/podcast";
import { supabase } from "@/lib/supabase";
import type { CaseStudy, Testimonial, Director, Podcast } from "@/lib/types";

export const revalidate = 0;

async function getCaseStudies() {
  try {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);
    
    if (error) {
      logger.error("Supabase error fetching case studies on home:", error);
      return [];
    }
    
    return (data || []) as CaseStudy[];
  } catch (e) {
    logger.error("Catch error fetching case studies on home:", e);
    return [];
  }
}

async function getTestimonials() {
  try {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2);
    return (data || []) as Testimonial[];
  } catch (e) {
    return [];
  }
}

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

async function getPodcasts() {
  try {
    const { data } = await supabase
      .from("podcasts")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(3);
    return (data || []) as Podcast[];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const [caseStudies, testimonials, directors, podcasts] = await Promise.all([
    getCaseStudies(),
    getTestimonials(),
    getDirectors(),
    getPodcasts(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs md:text-sm font-bold text-primary animate-in fade-in zoom-in duration-1000 delay-200 uppercase tracking-widest shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-ping" />
                Shipping MVPs in 4-8 weeks
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 font-heading">
                Full-Stack <br />
                <span className="text-primary italic">Engineering</span> <br />
                for Startups.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-in fade-in duration-1000 delay-500 font-medium">
                We build production-ready products, automate QA, and rescue projects with a <span className="text-foreground underline decoration-primary/30 decoration-4 underline-offset-4">technical-first</span> approach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                <Link href="/contact">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30 rounded-2xl group transition-all hover:scale-[1.02]">
                    Build My MVP
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/work">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-2 rounded-2xl transition-all hover:bg-muted">
                    View Portfolio
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] pt-8 animate-in fade-in duration-1000 delay-1000 opacity-70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Fixed-cost delivery
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Direct CTO access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  QA-first methodology
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-[650px] aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden border-8 border-background bg-muted shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 group">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Digital product development dashboard"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/80 backdrop-blur-md rounded-2xl border shadow-xl animate-in slide-in-from-bottom-4 duration-1000 delay-1000">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="h-6 w-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight">Active Projects</p>
                    <p className="text-xs text-muted-foreground font-medium">Monitoring 4.2k active nodes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Proof Bar */}
      <section className="bg-background py-16 border-y">
        <div className="container overflow-hidden">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-12">Building with industry leaders</p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 md:gap-x-24 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {["TECHSTREAM", "BLOOM", "NEXUS", "QUANTUM", "VELOCITY"].map((name) => (
              <div key={name} className="text-xl md:text-3xl font-black tracking-tighter hover:text-primary cursor-default transition-colors grayscale hover:grayscale-0">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Services Section */}
            <section className="py-24 bg-background overflow-hidden relative">
              <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
                          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Capabilities</h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] font-heading">Solutions for every <span className="text-primary italic">stage.</span></h3>
                          </div>
                                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "MVP Build",
                      icon: Boxes,
                      description: "Ship your product in weeks, not months. Full-stack development with QA embedded from day one to ensure a scalable foundation.",
                      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    },
                    {
                      title: "QA Automation",
                      icon: Microscope,
                      description: "Catch bugs before users do. Comprehensive end-to-end automated testing that scales seamlessly with your product growth.",
                      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    },
                    {
                      title: "Rescue & Audit",
                      icon: Activity,
                      description: "Inherited a mess? We audit, fix, and stabilize troubled codebases fast, transforming technical debt into a competitive advantage.",
                      color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  ].map((service, i) => (
                    <Card key={i} className="border-4 border-muted/20 bg-muted/10 hover:bg-muted/30 transition-all hover:-translate-y-2 duration-500 rounded-[2.5rem] p-4 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <service.icon size={120} />
                      </div>
                      <CardHeader className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-2xl border transition-transform duration-500 group-hover:rotate-6`}>
                          <service.icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">{service.title}</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground font-medium pt-2 leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <div className="px-6 pb-6 pt-2">
                         <div className="h-px w-full bg-foreground/5 mb-4" />
                         <p className="text-[10px] font-black tracking-[0.3em] opacity-30">TECH SPEC // SYSTEM CORE</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
      
            {/* Case Studies Section */}
            {caseStudies.length > 0 && (
              <section className="py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="container relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                  <div className="max-w-2xl space-y-4">
                                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Recent Work</h2>
                                    <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[0.9] font-heading">Real-world <span className="text-primary italic">results.</span></h3>
                                  </div>
                    
                    <Link href="/work">
                      <Button variant="outline" size="lg" className="rounded-2xl font-black h-14 px-8 border-2">View Portfolio</Button>
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-10">
                    {caseStudies.map((cs) => (
                      <CaseStudyCard key={cs.id} caseStudy={cs} />
                    ))}
                  </div>
                </div>
              </section>
            )}
      
            {/* Process Section */}
            <section className="py-24 bg-background relative overflow-hidden">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
              <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
                          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Our Process</h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] font-heading">A framework for <span className="text-primary italic">quality.</span></h3>
                          </div>
                                <div className="max-w-4xl mx-auto space-y-12">
                  {[
                    { 
                      step: "01", 
                      title: "Discovery & Roadmap", 
                      icon: Search,
                      desc: "We map your requirements, technical risks, and success metrics. No surprises, just a clear plan." 
                    },
                    { 
                      step: "02", 
                      title: "Rapid Development", 
                      icon: Code2,
                      desc: "Agile sprints focused on high-value features. You get a working build every single week." 
                    },
                    { 
                      step: "03", 
                      title: "QA Embedding", 
                      icon: Bug,
                      desc: "Automated and manual testing are baked into the code as it&apos;s written, not added at the end." 
                    },
                    { 
                      step: "04", 
                      title: "Launch & Confidence", 
                      icon: Rocket,
                      desc: "Zero-downtime deployment with high-availability monitoring to ensure a smooth transition to live." 
                    },
                    { 
                      step: "05", 
                      title: "Scaling & Support", 
                      icon: BarChart3,
                      desc: "Post-launch maintenance and optimization to help your product grow with your user base." 
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 md:gap-12 relative group animate-in fade-in slide-in-from-left-4 duration-700" style={{ transitionDelay: `${i * 150}ms` }}>
                      {i < 4 && <div className="absolute left-7 md:left-9 top-16 bottom-[-48px] w-1 bg-muted group-hover:bg-primary/20 transition-colors rounded-full" />}
                      <div className="flex-shrink-0 w-14 h-14 md:w-18 md:h-18 rounded-2xl border-4 border-muted bg-background flex items-center justify-center z-10 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <span className="text-xl font-black text-primary">{item.step}</span>
                      </div>
                      <div className="pt-2 md:pt-4 space-y-3 pb-12">
                        <h4 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-4">
                          <item.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl leading-relaxed">{item.desc}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 text-[10px] font-black uppercase tracking-widest opacity-40">
                          Process Milestone // Step {item.step}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            {/* Directors Section */}
      <DirectorsSection directors={directors} />

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Feedback</h2>
            <h3 className="text-3xl md:text-5xl font-bold">What our partners say about us.</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <Card key={t.id} className="border-none shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-[2.5rem] bg-muted/20">
                  <CardHeader className="pb-4 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl border-2 border-primary/10">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-xl leading-none tracking-tight break-words">{t.name}</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-2">{t.role}, {t.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="h-3 w-3 fill-primary text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-px w-full bg-foreground/5 mb-6" />
                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic break-words">
                      &quot;{t.quote}&quot;
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="border-none shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300 rounded-[2.5rem] bg-muted/20">
                  <CardHeader className="pb-4 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl border-2 border-primary/10">AR</div>
                      <div>
                        <p className="font-black text-xl leading-none tracking-tight">Alex Rivers</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-2">CTO at TechStream</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="h-3 w-3 fill-primary text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-px w-full bg-foreground/5 mb-6" />
                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                      &quot;MAPRIMO transformed our development process. Their QA-first approach saved us weeks of rework and delivered a superior product.&quot;
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300 rounded-[2.5rem] bg-muted/20">
                  <CardHeader className="pb-4 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl border-2 border-primary/10">SC</div>
                      <div>
                        <p className="font-black text-xl leading-none tracking-tight">Sarah Chen</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-2">Founder of Bloom</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="h-3 w-3 fill-primary text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-px w-full bg-foreground/5 mb-6" />
                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                      &quot;The MVP they built was production-ready from day one. Truly a strategic partner, not just another dev shop.&quot;
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <PodcastSection episodes={podcasts} />

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">FAQ</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight font-heading">Frequently asked questions.</h3>
          </div>
          
          <div className="max-w-2xl mx-auto bg-muted/20 rounded-xl border p-2 md:p-6">
            <AccordionItem trigger="How long does an MVP take?">
              Typically 4-8 weeks depending on complexity. We focus on building the &quot;Minimum&quot; part of MVP so you can start gathering real user feedback as fast as possible without compromising quality.
            </AccordionItem>
            <AccordionItem trigger="Do you work with non-technical founders?">
              Absolutely. We act as your technical partner, explaining trade-offs in plain English and helping you make product decisions that align with your business goals.
            </AccordionItem>
            <AccordionItem trigger="What tech stack do you use?">
              While we are experts in Next.js, React, Node.js, and Supabase, we choose the right tool for the job. Our primary focus is on choosing technology that is scalable, secure, and cost-effective.
            </AccordionItem>
            <AccordionItem trigger="What does &apos;QA-first&apos; mean?">
              It means we write tests alongside code. Instead of waiting until the end of the project to find bugs, we catch them instantly. This results in faster delivery and a significantly more stable product.
            </AccordionItem>
            <AccordionItem trigger="Do you offer ongoing support?">
              Yes. We offer flexible retainer-based maintenance and scaling packages to support your product as it grows post-launch.
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 mb-16 animate-in fade-in zoom-in duration-1000 delay-300">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground md:px-12 md:py-28 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-white/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-[200px] w-[200px] rounded-full bg-black/10 blur-[60px]" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight font-heading">Ready to build your next breakthrough?</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Stop fighting bugs and start shipping features. Let&apos;s discuss your project roadmap and how we can help you hit your next milestone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                  Schedule Your Free Audit
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary-foreground/20 hover:bg-white/10">
                  Explore Services
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-70">No strings attached. Just a real technical conversation.</p>
          </div>
        </div>
      </section>
    </>
  );
}
