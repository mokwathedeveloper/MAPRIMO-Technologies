import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 border-2 border-red-100 rounded-xl bg-red-50/30 text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-red-900">{title}</h3>
      <p className="text-red-700 max-w-xs mx-auto mt-2 text-sm">
        {message}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="mt-6 gap-2 border-red-200 hover:bg-red-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
