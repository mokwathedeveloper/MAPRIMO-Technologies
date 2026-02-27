import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse rounded-[2.5rem] border-none bg-muted/20">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-48 h-48 bg-muted/40 flex-shrink-0" />
            <div className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8">
                <div className="space-y-3 w-full max-w-[250px]">
                  <div className="h-8 bg-muted/40 rounded-xl w-full" />
                  <div className="h-4 bg-muted/20 rounded-lg w-2/3" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-muted/40 rounded-xl" />
                  <div className="h-10 w-10 bg-muted/40 rounded-xl" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-8 pb-8 pt-0">
                <div className="h-4 bg-muted/20 rounded-lg w-full" />
                <div className="h-4 bg-muted/20 rounded-lg w-5/6" />
                <div className="flex gap-3 mt-6">
                  <div className="h-6 w-16 bg-muted/30 rounded-lg" />
                  <div className="h-6 w-16 bg-muted/30 rounded-lg" />
                  <div className="h-6 w-16 bg-muted/30 rounded-lg" />
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
