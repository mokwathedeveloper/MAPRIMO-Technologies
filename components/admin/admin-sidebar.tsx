"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Users, 
  ExternalLink,
  Newspaper,
  Mic2,
  UserRound,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/case-studies", label: "Case Studies", icon: Newspaper },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/podcasts", label: "Podcasts", icon: Mic2 },
  { href: "/admin/directors", label: "Directors", icon: UserRound },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-background">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 transition-transform group-hover:rotate-3">
            M
          </div>
          <span className="font-black text-lg tracking-tighter uppercase">Admin Panel</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
              )}
            >
              <link.icon className={cn(
                "h-4 w-4 transition-transform",
                !isActive && "group-hover:scale-110"
              )} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2 bg-muted/10">
        <Link 
          href="/" 
          target="_blank" 
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-xs font-black uppercase tracking-widest text-muted-foreground"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View Site</span>
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut()}
          className="w-full justify-start px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-black uppercase tracking-widest gap-3"
        >
          <LogOut size={12} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
