import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t-4 border-muted/20 relative overflow-hidden">
      {/* Abstract technical element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container max-w-7xl py-24 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-xl shadow-primary/20">
                M
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase font-heading">MAPRIMO</span>
            </Link>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground max-w-xs">
              Full-Stack engineering and QA automation for the next generation of digital leaders.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="h-12 w-12 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300"
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Services</h4>
            <ul className="space-y-4 text-base font-bold text-muted-foreground uppercase tracking-widest">
              <li><Link href="/services" className="hover:text-foreground transition-colors flex items-center gap-2 group">MVP Build <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors flex items-center gap-2 group">QA Automation <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors flex items-center gap-2 group">Rescue & Audit <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors flex items-center gap-2 group">Scalability <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence</h4>
            <ul className="space-y-4 text-base font-bold text-muted-foreground uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Our Mission</Link></li>
              <li><Link href="/work" className="hover:text-foreground transition-colors">Portfolio</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Engineering Blog</Link></li>
              <li><Link href="/podcast" className="hover:text-foreground transition-colors">Technical Podcast</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Stack</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Communication</h4>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              Subscribe to our technical reports for the latest insights on high-performance engineering.
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="ENGINEER@COMPANY.COM" 
                className="w-full h-14 px-6 rounded-2xl border-2 border-muted bg-muted/20 text-xs font-black tracking-widest focus:outline-none focus:border-primary/30 transition-all uppercase"
              />
              <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                Join Network
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-muted/30 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
              © {currentYear} MAPRIMO TECHNOLOGIES // ALL PROTOCOLS RESERVED.
            </p>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Status: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
