import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 space-y-12 max-w-2xl">
        {/* Large 404 text with technical flair */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Search className="h-3.5 w-3.5" />
            Error 404: Route Not Resolved
          </div>
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Lost in the <br /><span className="text-primary italic">Stack.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
            The page you're looking for has either been refactored, <br className="hidden md:block" /> moved, or deleted from our technical specification.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="h-14 px-10 rounded-2xl font-black text-lg gap-3 shadow-2xl shadow-primary/20">
              <Home className="h-5 w-5" />
              Return Home
            </Button>
          </Link>
          <Link href="/work">
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-black text-lg gap-3 border-2">
              <ArrowLeft className="h-5 w-5" />
              Back to Work
            </Button>
          </Link>
        </div>

        {/* Terminal-like footer */}
        <div className="pt-12">
          <div className="bg-muted/30 border rounded-2xl p-6 text-left font-mono text-xs text-muted-foreground/60 max-w-sm mx-auto space-y-1">
            <p>$ maprimo-cli locate-page --slug="current"</p>
            <p className="text-red-500/60">error: PAGE_NOT_FOUND_EXCEPTION</p>
            <p>&gt; initializing fallback sequence...</p>
            <p>&gt; redirection protocols ready.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
