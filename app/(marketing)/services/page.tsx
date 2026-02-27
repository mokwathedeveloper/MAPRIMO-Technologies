import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, ShieldCheck, Zap, CheckCircle2, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "MVP Build, QA Automation, and Rescue & Audit services for startups and SMEs.",
};

const services = [
  {
    title: "MVP Build",
    description: "Ship your product in weeks, not months.",
    icon: Rocket,
    longDesc: "We build production-ready MVPs with QA embedded from day one. No technical debt, no shortcuts that bite you later. We focus on scalable architecture so you can grow seamlessly.",
    features: [
      "Full-stack development (React, Next.js, Node.js)",
      "Automated testing from sprint one",
      "CI/CD pipeline setup",
      "Cloud deployment & secure infrastructure",
      "Post-launch support & monitoring"
    ],
    meta: "Timeline: 4-8 weeks",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  },
  {
    title: "QA Automation",
    description: "Catch bugs before users do.",
    icon: ShieldCheck,
    longDesc: "Automated testing that scales with your product. We build comprehensive test suites that give your engineering team the confidence to ship daily without fear of regressions.",
    features: [
      "End-to-end test automation (Playwright/Cypress)",
      "API testing & performance monitoring",
      "Integration with your existing CI/CD",
      "Test maintenance & visual reporting",
      "QA strategy & team training"
    ],
    meta: "Ideal for: Growing scale-ups",
    color: "bg-green-500/10 text-green-600 border-green-500/20"
  },
  {
    title: "Rescue & Audit",
    description: "Inherited a mess? We fix it.",
    icon: Zap,
    longDesc: "We audit troubled codebases, identify critical security and performance issues, and stabilize your product fast so you can get back to building features instead of fighting fires.",
    features: [
      "Comprehensive code audit & security review",
      "Performance optimization & refactoring",
      "Critical bug fixes & stabilization",
      "Technical debt reduction strategy",
      "Clean team handoff & documentation"
    ],
    meta: "Timeline: 2-4 weeks",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
  }
];

export default function ServicesPage() {
  return (
    <>
      {/* Header Section */}
      <section className="bg-muted/30 pt-32 pb-24 md:pt-40 md:pb-32 border-b relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="container max-w-6xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-[10px] font-black text-primary shadow-sm uppercase tracking-[0.2em] mb-4">
            Our Capabilities
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[0.9]">
            Engineering <br /> <span className="text-primary italic">for scale.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Full-stack development with QA embedded. We help you ship faster and break less.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-5xl space-y-24 md:space-y-32">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-20 items-center group`}>
                <div className="flex-1 space-y-8">
                  <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl border transition-transform duration-500 group-hover:rotate-6 ${service.color}`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">{service.title}</h2>
                    <p className="text-sm font-black text-primary uppercase tracking-[0.2em]">{service.meta}</p>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">{service.longDesc}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-bold text-foreground/80 tracking-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Link href="/contact">
                      <Button className="rounded-xl font-bold h-12 px-8 shadow-xl shadow-primary/10">
                        Start Your {service.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1 relative w-full aspect-square rounded-[3rem] overflow-hidden border-8 border-muted/20 shadow-inner bg-muted/10 group-hover:border-primary/10 transition-colors duration-500">
                   <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
                      <Icon className="w-64 h-64" />
                   </div>
                   {/* Abstract tech pattern */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-4">
                      <h3 className="text-2xl font-black tracking-tighter opacity-20 uppercase">{service.title} CORE</h3>
                      <div className="w-full h-px bg-foreground/10" />
                      <p className="text-xs font-bold tracking-[0.3em] opacity-30">TECHNICAL SPECIFICATION V2.0</p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 mb-16">
        <div className="container max-w-5xl">
          <div className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-[60px]" />
            <Calendar className="h-20 w-20 mx-auto opacity-50 animate-bounce duration-[3000ms]" />
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">Ready to build?</h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
                Skip the back-and-forth email chain. Book a strategy call directly with our engineering team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4 relative z-10">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl">
                  Book Strategy Call
                </Button>
              </Link>
              <Link href="/work">
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-black rounded-2xl border-primary-foreground/20 hover:bg-white/10">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
