import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudyCard } from "@/components/case-study-card";
import { AccordionItem } from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase";
import type { CaseStudy, Testimonial } from "@/lib/types";

export const revalidate = 3600;

async function getCaseStudies() {
  try {
    const { data } = await supabase
      .from("case_studies")
      .select("*, projects(*)")
      .eq("projects.published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return (data || []) as CaseStudy[];
  } catch (e) {
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

export default async function HomePage() {
  const [caseStudies, testimonials] = await Promise.all([
    getCaseStudies(),
    getTestimonials(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="container py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Full-Stack + QA that ships fast and breaks less
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We build MVPs, automate QA, and rescue troubled projects for SMEs and funded startups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Book a Call</Button>
            </Link>
            <Link href="/work">
              <Button size="lg" variant="outline">View Our Work</Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>✓ Placeholder Metric 1</span>
            <span>✓ Placeholder Metric 2</span>
            <span>✓ Placeholder Metric 3</span>
          </div>
        </div>
      </section>

      {/* Proof Bar */}
      <section className="border-y bg-muted/50 py-8">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-4">Trusted by (Placeholder Logos)</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-muted-foreground">Logo 1</div>
            <div className="text-muted-foreground">Logo 2</div>
            <div className="text-muted-foreground">Logo 3</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>MVP Build</CardTitle>
              <CardDescription>
                Ship your product in weeks, not months. Full-stack development with QA embedded from day one.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>QA Automation</CardTitle>
              <CardDescription>
                Catch bugs before users do. Automated testing that scales with your product.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rescue & Audit</CardTitle>
              <CardDescription>
                Inherited a mess? We audit, fix, and stabilize troubled codebases fast.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Case Studies */}
      {caseStudies.length > 0 && (
        <section className="container py-24 bg-muted/50">
          <h2 className="text-3xl font-bold text-center mb-12">Case Studies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/work">
              <Button variant="outline">View All Work</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            { step: "1. Discover", desc: "We map your requirements, risks, and success metrics." },
            { step: "2. Build", desc: "Rapid development with QA embedded at every sprint." },
            { step: "3. Test", desc: "Automated + manual testing before every release." },
            { step: "4. Ship", desc: "Deploy with confidence. Zero-downtime releases." },
            { step: "5. Support", desc: "Post-launch monitoring and rapid fixes." },
          ].map((item) => (
            <Card key={item.step}>
              <CardHeader>
                <CardTitle className="text-lg">{item.step}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <Card key={t.id}>
                <CardHeader>
                  <CardDescription className="italic">
                    "{t.quote}"
                  </CardDescription>
                  <CardTitle className="text-base mt-4">
                    — {t.name}, {t.company}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardDescription className="italic">
                    "MAPRIMO transformed our development process. Their QA-first approach saved us weeks of rework."
                  </CardDescription>
                  <CardTitle className="text-base mt-4">— Alex Rivers, CTO at TechStream</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription className="italic">
                    "The MVP they built was production-ready from day one. Truly a partner, not just a vendor."
                  </CardDescription>
                  <CardTitle className="text-base mt-4">— Sarah Chen, Founder of Bloom</CardTitle>
                </CardHeader>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="max-w-2xl mx-auto">
          <AccordionItem trigger="How long does an MVP take?">
            Typically 4-8 weeks depending on scope. We prioritize speed without sacrificing quality.
          </AccordionItem>
          <AccordionItem trigger="Do you work with startups?">
            Yes! We specialize in SMEs and funded startups that need to move fast.
          </AccordionItem>
          <AccordionItem trigger="What tech stack do you use?">
            We&apos;re stack-agnostic but prefer modern frameworks like Next.js, React, Node.js, and cloud-native infrastructure.
          </AccordionItem>
          <AccordionItem trigger="Do you offer ongoing support?">
            Absolutely. We offer retainer-based support and maintenance packages.
          </AccordionItem>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ship faster?</h2>
          <p className="text-lg mb-8 opacity-90">
            Let's talk about your project. No sales pitch—just a real conversation.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">Get Started</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
