import { LeadForm } from "@/components/lead-form";
import { Mail, Clock, MapPin, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with us to discuss your MVP build, QA automation, or codebase audit.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-muted/30 py-24 md:py-32 border-b">
        <div className="container max-w-6xl text-center space-y-6">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-primary shadow-sm mb-4">
            <MessageSquare className="h-4 w-4 mr-2" />
            Let's build together
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Start your next <br /> project with us.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? Fill out the form below and our engineering team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you need a full MVP build, an enterprise QA strategy, or a critical codebase rescue, we're ready to dive in.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-muted-foreground mt-1">hello@maprimo.com</p>
                    <p className="text-xs text-muted-foreground mt-1">We typically reply within a few hours.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Office Hours</h4>
                    <p className="text-muted-foreground mt-1">Mon-Fri, 9am - 6pm EST</p>
                    <p className="text-xs text-muted-foreground mt-1">Available for urgent audits upon request.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Global Remote</h4>
                    <p className="text-muted-foreground mt-1">Distributed Team</p>
                    <p className="text-xs text-muted-foreground mt-1">Serving clients worldwide.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="lg:col-span-2">
              <div className="bg-card p-8 md:p-12 border rounded-2xl shadow-xl shadow-primary/5">
                <LeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
