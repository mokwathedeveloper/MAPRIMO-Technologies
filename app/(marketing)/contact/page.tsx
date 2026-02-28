import { LeadForm } from "@/components/lead-form";
import { Mail, Clock, MapPin, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with us to discuss your MVP build, QA automation, or codebase audit.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-muted/30 pt-32 pb-24 md:pt-40 md:pb-32 border-b relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="container max-w-6xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-[10px] font-black text-primary shadow-sm uppercase tracking-[0.2em] mb-4">
            Get in touch
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[0.9]">
            Let&apos;s build <br /> <span className="text-primary italic">together.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Have a project in mind? Fill out the form below and our engineering team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-32">
            {/* Contact Info Sidebar */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h3 className="text-3xl font-black tracking-tight">Strategy awaits.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Whether you need a full MVP build, an enterprise QA strategy, or a critical codebase rescue, we&apos;re ready to dive in.
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Email</h4>
                    <p className="text-xl font-medium text-muted-foreground mt-1">hello@maprimo.com</p>
                    <p className="text-xs font-bold text-primary mt-2 uppercase tracking-widest opacity-70">Reply time: &lt; 4 hours</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Office Hours</h4>
                    <p className="text-xl font-medium text-muted-foreground mt-1">Mon-Fri, 9am - 6pm EST</p>
                    <p className="text-xs font-bold text-primary mt-2 uppercase tracking-widest opacity-70">Emergency audits available</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Location</h4>
                    <p className="text-xl font-medium text-muted-foreground mt-1">Global Remote</p>
                    <p className="text-xs font-bold text-primary mt-2 uppercase tracking-widest opacity-70">Distributed engineering team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1 scale-105" />
              <div className="relative bg-background p-8 md:p-16 border-4 border-muted/20 rounded-[3rem] shadow-2xl">
                <LeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
