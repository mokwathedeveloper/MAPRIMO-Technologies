"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Insights" },
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container max-w-7xl flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl transition-all group-hover:rotate-3 shadow-xl shadow-primary/20">
            M
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase font-heading">MAPRIMO</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn(
                    "text-sm font-black uppercase tracking-widest transition-all relative py-2 group/link",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500",
                    isActive ? "w-full" : "w-0 group-hover/link:w-1/2"
                  )} />
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4 pl-8 border-l-2 border-muted">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2 border-2">
                    <LayoutDashboard size={14} /> Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => signOut()}
                  className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                </Button>
              </div>
            ) : (
              <Link href="/contact">
                <Button className="h-12 px-8 font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Launch Project
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-20 z-50 bg-background/95 backdrop-blur-xl lg:hidden transition-all duration-500 ease-in-out border-t",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">Navigation Menu</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all active:scale-95",
                pathname.startsWith(link.href) 
                  ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20" 
                  : "bg-muted/20 border-transparent text-muted-foreground font-black uppercase tracking-widest text-sm"
              )}
            >
              {link.label}
              <ChevronRight size={18} className={cn(pathname.startsWith(link.href) ? "opacity-100" : "opacity-20")} />
            </Link>
          ))}
          
          <div className="pt-10 space-y-4">
            <Link href="/contact" className="block w-full">
              <Button size="lg" className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-lg shadow-2xl shadow-primary/30">
                Launch Project
              </Button>
            </Link>
            {user && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => signOut()}
                className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] border-2"
              >
                <LogOut size={20} className="mr-3" /> System Logout
              </Button>
            )}
          </div>
          <div className="pt-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">MAPRIMO Technologies // V2.0</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
