"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/podcast", label: "Podcast" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Close mobile nav when pathname changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container max-w-6xl flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold transition-transform group-hover:rotate-3">
            M
          </div>
          <span className="text-xl font-black tracking-tighter">MAPRIMO</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={cn(
                "text-sm font-semibold transition-colors hover:text-primary/90",
                pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 ml-4 pl-4 border-l">
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="text-xs font-bold gap-2"
              >
                <LogOut size={14} /> Logout
              </Button>
            ) : (
              <Link href="/contact">
                <Button size="sm" className="h-9 px-4 font-bold shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav Overlay (Sheet Alternative) */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 bg-background md:hidden transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        )}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all active:scale-95",
                pathname.startsWith(link.href) 
                  ? "bg-primary/5 border-primary/20 text-primary font-bold" 
                  : "bg-muted/30 border-transparent text-muted-foreground font-medium"
              )}
            >
              {link.label}
              <ChevronRight size={16} className="opacity-50" />
            </Link>
          ))}
          
          <div className="pt-8 space-y-4">
            <Link href="/contact" className="block w-full">
              <Button size="lg" className="w-full h-14 font-bold text-lg shadow-xl shadow-primary/20">
                Get Started Today
              </Button>
            </Link>
            {user && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => signOut()}
                className="w-full h-14 font-bold"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
