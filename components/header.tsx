"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          MAPRIMO
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/services" className="text-sm font-medium hover:underline">
            Services
          </Link>
          <Link href="/work" className="text-sm font-medium hover:underline">
            Work
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:underline">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="/contact">
            <Button size="sm">Get Started</Button>
          </Link>
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </Button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 bg-background md:hidden transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col items-center gap-8 pt-12">
          <Link
            href="/services"
            className="text-2xl font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/work"
            className="text-2xl font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Work
          </Link>
          <Link
            href="/blog"
            className="text-2xl font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-2xl font-semibold"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <Button size="lg">Get Started</Button>
          </Link>
          {user && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="mt-4"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
