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
  ArrowRight
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
      .select("*, projects(title, slug, cover_url, summary)")
      .order("created_at", { ascending: false })
      .limit(3);
    
    if (error) {
      console.error("Supabase error fetching case studies on home:", error);
      return [];
    }
    
    console.log(`Home: Fetched ${data?.length || 0} case studies`);
    return (data || []) as any[];
  } catch (e) {
    console.error("Catch error fetching case studies on home:", e);
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
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-primary animate-in fade-in zoom-in duration-1000 delay-200">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
                Now shipping MVPs in 4-8 weeks
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                Full-Stack + QA that ships fast and <span className="text-primary">breaks less.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-in fade-in duration-1000 delay-500">
                We build MVPs, automate QA, and rescue troubled projects for SMEs and funded startups. Get your product to market with zero technical debt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                <Link href="/contact">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Book a Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/work">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    View Our Work
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium pt-4 animate-in fade-in duration-1000 delay-1000">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Fixed-cost delivery
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  QA-first methodology
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Direct CTO access
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-[600px] aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden border bg-muted shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                alt="Digital product development dashboard"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Proof Bar */}
      <section className="border-y bg-muted/30 py-12 animate-in fade-in duration-1000 delay-700">
        <div className="container">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">Helping innovative companies grow</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-black italic tracking-tighter">TECHSTREAM</div>
            <div className="text-2xl font-black italic tracking-tighter">BLOOM</div>
            <div className="text-2xl font-black italic tracking-tighter">NEXUS</div>
            <div className="text-2xl font-black italic tracking-tighter">QUANTUM</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background overflow-hidden relative">
        <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Capabilities</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Solutions for every stage of your product lifecycle.</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "MVP Build",
                icon: Rocket,
                description: "Ship your product in weeks, not months. Full-stack development with QA embedded from day one to ensure a scalable foundation.",
                color: "bg-blue-500/10 text-blue-600"
              },
              {
                title: "QA Automation",
                icon: ShieldCheck,
                description: "Catch bugs before users do. Comprehensive end-to-end automated testing that scales seamlessly with your product growth.",
                color: "bg-green-500/10 text-green-600"
              },
              {
                title: "Rescue & Audit",
                icon: Zap,
                description: "Inherited a mess? We audit, fix, and stabilize troubled codebases fast, transforming technical debt into a competitive advantage.",
                color: "bg-purple-500/10 text-purple-600"
              }
            ].map((service, i) => (
              <Card key={i} className="border-none bg-muted/40 hover:bg-muted/60 transition-all hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground pt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      {caseStudies.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Recent Work</h2>
                <h3 className="text-3xl md:text-5xl font-bold text-foreground">Real-world results for real-world companies.</h3>
              </div>
              <Link href="/work">
                <Button variant="outline" size="lg">View All Case Studies</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="container animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Our Process</h2>
            <h3 className="text-3xl md:text-5xl font-bold">A proven framework for quality and speed.</h3>
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
                desc: "Automated and manual testing are baked into the code as it's written, not added at the end." 
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
              <div key={i} className="flex gap-6 md:gap-10 relative group animate-in fade-in slide-in-from-left-4 duration-700" style={{ transitionDelay: `${i * 150}ms` }}>
                {i < 4 && <div className="absolute left-6 md:left-8 top-14 bottom-[-48px] w-px bg-border group-hover:bg-primary/30 transition-colors" />}
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-primary/20 bg-background flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                  <span className="text-sm font-bold text-primary">{item.step}</span>
                </div>
                <div className="pt-2 md:pt-4 space-y-2">
                  <h4 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground md:text-lg max-w-2xl">{item.desc}</p>
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
                <Card key={t.id} className="border-none shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="h-4 w-4 fill-primary text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <CardDescription className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                      "{t.quote}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-base leading-none">{t.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t.role}, {t.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="border-none shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="h-4 w-4 fill-primary text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <CardDescription className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                      "MAPRIMO transformed our development process. Their QA-first approach saved us weeks of rework and delivered a superior product."
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-600 text-sm">AR</div>
                      <div>
                        <p className="font-bold text-base leading-none">Alex Rivers</p>
                        <p className="text-sm text-muted-foreground mt-1">CTO at TechStream</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="h-4 w-4 fill-primary text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <CardDescription className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                      "The MVP they built was production-ready from day one. Truly a strategic partner, not just another dev shop."
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center font-bold text-green-600 text-sm">SC</div>
                      <div>
                        <p className="font-bold text-base leading-none">Sarah Chen</p>
                        <p className="text-sm text-muted-foreground mt-1">Founder of Bloom</p>
                      </div>
                    </div>
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">FAQ</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Frequently asked questions.</h3>
          </div>
          
          <div className="max-w-2xl mx-auto bg-muted/20 rounded-xl border p-2 md:p-6">
            <AccordionItem trigger="How long does an MVP take?">
              Typically 4-8 weeks depending on complexity. We focus on building the "Minimum" part of MVP so you can start gathering real user feedback as fast as possible without compromising quality.
            </AccordionItem>
            <AccordionItem trigger="Do you work with non-technical founders?">
              Absolutely. We act as your technical partner, explaining trade-offs in plain English and helping you make product decisions that align with your business goals.
            </AccordionItem>
            <AccordionItem trigger="What tech stack do you use?">
              While we are experts in Next.js, React, Node.js, and Supabase, we choose the right tool for the job. Our primary focus is on choosing technology that is scalable, secure, and cost-effective.
            </AccordionItem>
            <AccordionItem trigger="What does 'QA-first' mean?">
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
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to build your next breakthrough?</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Stop fighting bugs and start shipping features. Let's discuss your project roadmap and how we can help you hit your next milestone.
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
