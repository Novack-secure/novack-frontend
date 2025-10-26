import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5 border border-white/10",
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3",
        className
      )}
    >
      {children}
    </div>
  );
}

function SkeletonText({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4 w-full", i === lines - 1 && "w-4/5")}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        "size-10 rounded-full border-2 border-[#07D9D9]/30",
        className
      )}
    />
  );
}

function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-24 rounded-lg", className)} />;
}

function SkeletonInput({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-full rounded-lg", className)} />;
}

function SkeletonTable({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-10 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-12 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonChat() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "flex gap-3",
            i % 2 === 0 ? "justify-end" : "justify-start"
          )}
        >
          {i % 2 !== 0 && <SkeletonAvatar />}
          <div className="flex flex-col gap-2 max-w-[70%]">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
          {i % 2 === 0 && <SkeletonAvatar />}
        </div>
      ))}
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="flex flex-col h-full p-3 overflow-auto space-y-3">
      {/* Breadcrumb */}
      <Skeleton className="h-6 w-48" />

      {/* Main Content */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Map */}
        <SkeletonCard className="flex-1">
          <Skeleton className="h-6 w-40 mb-3" />
          <Skeleton className="h-full w-full" />
        </SkeletonCard>

        {/* Notifications */}
        <SkeletonCard className="w-80">
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonTable,
  SkeletonChat,
  SkeletonDashboard,
};
