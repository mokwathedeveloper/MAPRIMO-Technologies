'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-8 max-w-md">
          <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto shadow-2xl shadow-red-500/20 border-2 border-red-500/20">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight font-heading uppercase">System Exception</h1>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              An unhandled technical exception has occurred. Our engineering team has been notified via Sentry.
            </p>
          </div>
          <Button 
            onClick={() => reset()} 
            size="lg"
            className="h-14 px-10 rounded-2xl font-black text-lg gap-3 shadow-2xl shadow-primary/20"
          >
            <RefreshCcw className="h-5 w-5" />
            Attempt Recovery
          </Button>
        </div>
      </body>
    </html>
  );
}
