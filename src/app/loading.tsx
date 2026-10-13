export default function RootLoading() {
  return (
    <div className="min-h-[70vh] w-full container-main py-12 animate-pulse space-y-8 select-none">
      {/* Top Banner Skeleton */}
      <div className="h-44 sm:h-56 w-full rounded-3xl bg-surface-secondary/70 border border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/70 bg-surface p-4 space-y-4 shadow-xs"
          >
            <div className="aspect-video w-full rounded-xl bg-surface-secondary/80" />
            <div className="h-4 w-3/4 rounded-md bg-surface-secondary/80" />
            <div className="h-3 w-1/2 rounded-md bg-surface-secondary/60" />
            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <div className="h-5 w-20 rounded-md bg-surface-secondary/80" />
              <div className="h-8 w-24 rounded-xl bg-primary/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
