"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://none.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy.key"
  ), []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push(redirectedFrom);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl transition-transform group-hover:rotate-3 shadow-xl shadow-primary/20">
              M
            </div>
            <span className="text-2xl font-black tracking-tighter">MAPRIMO</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight uppercase">Admin Access</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Secure Authentication Gateway</p>
        </div>

        <Card className="border-4 border-muted/20 rounded-[2.5rem] shadow-2xl overflow-hidden bg-background/80 backdrop-blur-sm">
          <CardHeader className="pt-10 pb-2 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold">Authorized Personnel Only</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-bold opacity-50">
              Enter encrypted credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-left block">Admin Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Admin Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium"
                      disabled={loading}
                      data-testid="login-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-left block">Access Token</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Access Token / Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium"
                      disabled={loading}
                      data-testid="login-password"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" 
                disabled={loading}
                data-testid="login-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Initiate Login
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
            &larr; Abort and return to site
          </Link>
        </div>
      </div>
    </div>
  );
}
