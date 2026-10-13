export default function CoursesLoading() {
  return (
    <div className="container-main py-10 sm:py-14 animate-pulse select-none space-y-8">
      {/* Title & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-surface-secondary/90" />
          <div className="h-4 w-72 rounded-md bg-surface-secondary/60" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-28 rounded-xl bg-surface-secondary/70" />
          <div className="h-10 w-36 rounded-xl bg-surface-secondary/70" />
        </div>
      </div>

      {/* Categories chips track skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-surface-secondary/80 shrink-0" />
        ))}
      </div>

      {/* Grid of Course Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/70 bg-surface p-4 space-y-4 shadow-sm"
          >
            <div className="aspect-video w-full rounded-2xl bg-surface-secondary/80" />
            <div className="h-5 w-4/5 rounded-md bg-surface-secondary/80" />
            <div className="h-3.5 w-3/5 rounded-md bg-surface-secondary/60" />
            <div className="h-10 w-full rounded-2xl bg-surface-secondary/40" />
            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <div className="h-6 w-20 rounded-md bg-primary/20" />
              <div className="h-9 w-24 rounded-xl bg-primary/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
