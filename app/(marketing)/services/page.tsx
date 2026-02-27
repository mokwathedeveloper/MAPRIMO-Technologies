import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Boxes, 
  Microscope, 
  Activity, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Database,
  Cpu,
  LayoutDashboard
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "MVP Build, QA Automation, and Rescue & Audit services for startups and SMEs.",
};

const services = [
  {
    title: "MVP Build",
    description: "Architecting for scale from Day 1.",
    icon: Boxes,
    longDesc: "We don't just build features; we engineer systems. Our MVP process focuses on delivering a production-ready core that's ready for your first 10,000 users, not just a simple proof of concept.",
    features: [
      "Scalable Next.js Architecture",
      "Clean Code & SOLID Principles",
      "Automated CI/CD Pipelines",
      "Cloud-Native Infrastructure",
      "Post-Launch Technical SEO"
    ],
    meta: "Launch: 4-8 weeks",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  },
  {
    title: "QA Automation",
    description: "Eliminate regressions, ship daily.",
    icon: Microscope,
    longDesc: "Manual testing is a bottleneck. We implement comprehensive E2E and API test suites that act as a safety net, allowing your team to deploy with 100% confidence multiple times a day.",
    features: [
      "Playwright/Cypress E2E Suites",
      "API & Integration Testing",
      "Visual Regression Testing",
      "Load & Performance Audits",
      "QA Team Mentorship"
    ],
    meta: "Focus: Zero-Defect Delivery",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    title: "Rescue & Audit",
    description: "Stabilizing shaky foundations.",
    icon: Activity,
    longDesc: "Struggling with slow performance or constant crashes? We dive deep into your codebase to identify bottlenecks, security risks, and technical debt, providing a clear path to stability.",
    features: [
      "Deep Codebase Forensics",
      "Security & Vulnerability Audit",
      "Refactoring for Performance",
      "Cloud Cost Optimization",
      "Modernization Roadmap"
    ],
    meta: "Audit: 2-Week Sprint",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  }
];

const techStack = [
  { name: "Frontend", tools: ["Next.js", "React", "Tailwind CSS", "TypeScript"], icon: LayoutDashboard },
  { name: "Backend", tools: ["Node.js", "Supabase", "PostgreSQL", "Prisma"], icon: Database },
  { name: "DevOps", tools: ["Vercel", "Docker", "AWS", "GitHub Actions"], icon: Cpu },
  { name: "QA", tools: ["Playwright", "Jest", "Cypress", "Postman"], icon: Microscope },
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
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[0.9] font-heading">
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
                  <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl border transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${service.color}`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight font-heading">{service.title}</h2>
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
                      <Button className="rounded-xl font-bold h-12 px-8 shadow-xl shadow-primary/10 transition-all hover:scale-105">
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
                      <div className="h-px w-12 bg-primary/30" />
                      <h3 className="text-2xl font-black tracking-tighter opacity-20 uppercase">{service.title} CORE</h3>
                      <div className="w-full h-px bg-foreground/10" />
                      <p className="text-[10px] font-black tracking-[0.4em] opacity-30">TECH SPEC V2.0 // MAPRIMO</p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-muted/20 border-y">
        <div className="container max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">The Stack</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight font-heading">Our Technical Arsenal.</h3>
            <p className="text-xl text-muted-foreground font-medium">We use industry-leading tools to build, test, and deploy exceptional software.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {techStack.map((stack, i) => (
              <Card key={i} className="p-8 rounded-[2rem] border-none shadow-sm bg-background hover:shadow-2xl transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <stack.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black mb-4 tracking-tight uppercase">{stack.name}</h4>
                <ul className="space-y-2">
                  {stack.tools.map(tool => (
                    <li key={tool} className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary/40" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 mb-16">
        <div className="container max-w-5xl">
          <div className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-[60px]" />
            <Calendar className="h-20 w-20 mx-auto opacity-50 transition-transform duration-700 group-hover:scale-110" />
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">Ready to build?</h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
                Skip the back-and-forth email chain. Book a strategy call directly with our engineering team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4 relative z-10">
              <Link href="/contact" className="inline-block">
                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl transition-all hover:scale-[1.02]">
                  Book Strategy Call
                </Button>
              </Link>
              <Link href="/work" className="inline-block">
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
