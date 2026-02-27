import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container max-w-6xl py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                M
              </div>
              <span className="text-xl font-black tracking-tighter">MAPRIMO</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Full-Stack development + QA automation that ships fast and breaks less. We build scalable products for SMEs and funded startups.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 rounded-full bg-background border hover:text-primary transition-colors">
                <Twitter size={16} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-background border hover:text-primary transition-colors">
                <Github size={16} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-background border hover:text-primary transition-colors">
                <Linkedin size={16} />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Services</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">MVP Build</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">QA Automation</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Rescue & Audit</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Custom Software</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/work" className="hover:text-primary transition-colors">Our Work</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Insights</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest insights on shipping quality software.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-muted-foreground">
            © {currentYear} MAPRIMO Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-xs font-medium text-primary flex items-center gap-1">
              <Mail size={12} />
              hello@maprimo.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
