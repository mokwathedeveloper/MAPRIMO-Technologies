import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, ShieldCheck, LifeBuoy, CheckCircle2, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | MAPRIMO Technologies",
  description: "MVP Build, QA Automation, and Rescue & Audit services for startups and SMEs.",
};

const services = [
  {
    title: "MVP Build",
    description: "Ship your product in weeks, not months",
    icon: Rocket,
    longDesc: "We build production-ready MVPs with QA embedded from day one. No technical debt, no shortcuts that bite you later.",
    features: [
      "Full-stack development (React, Next.js, Node.js)",
      "Automated testing from sprint 1",
      "CI/CD pipeline setup",
      "Cloud deployment & infrastructure",
      "Post-launch support"
    ],
    meta: "Timeline: 4-8 weeks"
  },
  {
    title: "QA Automation",
    description: "Catch bugs before users do",
    icon: ShieldCheck,
    longDesc: "Automated testing that scales with your product. We build test suites that give you confidence to ship daily.",
    features: [
      "End-to-end test automation (Playwright/Cypress)",
      "API testing & performance monitoring",
      "Integration with your existing CI/CD",
      "Test maintenance & reporting",
      "QA strategy & consulting"
    ],
    meta: "Ideal for: Growing products"
  },
  {
    title: "Rescue & Audit",
    description: "Inherited a mess? We fix it.",
    icon: LifeBuoy,
    longDesc: "We audit troubled codebases, identify critical issues, and stabilize your product fast.",
    features: [
      "Code audit & security review",
      "Performance optimization",
      "Bug fixes & stabilization",
      "Technical debt reduction",
      "Team handoff & documentation"
    ],
    meta: "Timeline: 2-4 weeks for audit"
  }
];

export default function ServicesPage() {
  return (
    <div className="container py-24">
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground">
          Full-stack development with QA embedded. We help you ship faster and break less.
        </p>
      </div>

      <div className="grid gap-12">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <section key={index} className="scroll-mt-20">
              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                <div className="grid md:grid-cols-3">
                  <div className="p-8 bg-muted/30 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <Icon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                    <p className="text-sm font-semibold text-primary">{service.meta}</p>
                  </div>
                  <div className="p-8 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{service.description}</h3>
                      <p className="text-muted-foreground mb-6">{service.longDesc}</p>
                      <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-4">
                      <Link href="/contact">
                        <Button>Get a Quote</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          );
        })}
      </div>

      <section className="mt-24 rounded-3xl bg-primary text-primary-foreground p-12 text-center">
        <Calendar size={48} className="mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl font-bold mb-4">Ready to build something great?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
          Skip the back-and-forth email chain. Book a strategy call directly with our engineering team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Book a Strategy Call
            </Button>
          </Link>
          <Link href="/work">
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Our Portfolio
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
