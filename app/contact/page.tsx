import { LeadForm } from "@/components/lead-form";

export const metadata = {
  title: "Contact Us | MAPRIMO Technologies",
  description: "Get in touch with us to discuss your MVP build, QA automation, or codebase audit.",
};

export default function ContactPage() {
  return (
    <div className="container py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Let&apos;s Talk</h1>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-card p-8 border rounded-lg shadow-sm">
          <LeadForm />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div>
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="text-muted-foreground">hello@maprimo.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Office Hours</h3>
            <p className="text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
