import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo and Animation */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full border-4 border-primary/10" />
          <div className="absolute h-24 w-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-2xl shadow-primary/20">
            M
          </div>
        </div>
        
        {/* Technical Progress Text */}
        <div className="text-center space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-primary animate-pulse">Initializing System</p>
          <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">MAPRIMO Technologies V2.0</p>
        </div>

        {/* Abstract Technical Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      </div>
    </div>
  );
}
