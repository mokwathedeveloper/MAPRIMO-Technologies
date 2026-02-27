import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, ShieldCheck, Zap, CheckCircle2, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | MAPRIMO Technologies",
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
      <section className="bg-muted/30 py-24 md:py-32 border-b">
        <div className="container max-w-6xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Engineering capabilities <br /> tailored for scale.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Full-stack development with QA embedded. We help you ship faster and break less.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-5xl space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-colors shadow-sm">
                <div className="grid md:grid-cols-3">
                  <div className={`p-8 md:p-10 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r bg-muted/20`}>
                    <div className={`h-20 w-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${service.color}`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider">{service.meta}</p>
                  </div>
                  <div className="p-8 md:p-10 md:col-span-2 flex flex-col justify-between space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-foreground/90">{service.description}</h3>
                      <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{service.longDesc}</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t">
                      <Link href="/contact" className="inline-flex items-center text-sm font-bold text-primary hover:underline">
                        Discuss this service
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 text-center space-y-8 shadow-xl">
            <Calendar className="h-16 w-16 mx-auto opacity-80" />
            <h2 className="text-3xl md:text-5xl font-bold">Ready to build something great?</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto leading-relaxed">
              Skip the back-and-forth email chain. Book a strategy call directly with our engineering team to map out your next move.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                  Book a Strategy Call
                </Button>
              </Link>
              <Link href="/work">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary-foreground/20 hover:bg-white/10">
                  View Our Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
