import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-48 h-32 bg-muted flex-shrink-0" />
            <div className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-2 w-full max-w-[200px]">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-9 bg-muted rounded" />
                  <div className="h-9 w-9 bg-muted rounded" />
                  <div className="h-9 w-9 bg-muted rounded" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="flex gap-2 mt-4">
                  <div className="h-5 w-12 bg-muted rounded" />
                  <div className="h-5 w-12 bg-muted rounded" />
                  <div className="h-5 w-12 bg-muted rounded" />
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
