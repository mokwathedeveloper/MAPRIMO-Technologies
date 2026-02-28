'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry
    Sentry.captureException(error);
    
    // Log to our internal structured logger
    logger.error('Server Component Render Error', error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          A technical error occurred while rendering this section. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-muted-foreground mt-4 opacity-50">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
      <Button
        onClick={() => reset()}
        variant="outline"
        className="gap-2 rounded-xl font-bold border-2"
      >
        <RotateCcw size={16} />
        Try again
      </Button>
    </div>
  );
}
