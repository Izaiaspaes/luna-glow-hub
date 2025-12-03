import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const FeaturesSkeleton = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-12 w-2/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-2 bg-gradient-card">
              <div className="relative p-8 space-y-6">
                <Skeleton className="w-full h-48 -mx-8 -mt-8 mb-6" />
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
