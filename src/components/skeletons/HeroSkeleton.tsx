import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-soft">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content Skeleton */}
          <div className="space-y-8 text-center lg:text-left">
            <Skeleton className="h-12 w-3/4 mx-auto lg:mx-0" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6 mx-auto lg:mx-0" />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Hero Image Skeleton */}
          <div className="relative lg:order-last">
            <Skeleton className="w-full h-[400px] lg:h-[500px] rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
