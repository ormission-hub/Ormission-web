export default function CategoryLoading() {
  return (
    <div className="bg-background min-h-screen py-8 lg:py-12 animate-pulse">
      <div className="container-main">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-3 w-24 bg-primary/20 rounded" />
        </div>

        {/* Hero Banner Skeleton */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface dark:bg-slate-900/80 p-6 sm:p-8 lg:p-10 mb-8 shadow-xs">
          <div className="h-6 w-28 rounded-full bg-primary/10 border border-primary/20 mb-4" />
          <div className="h-10 w-64 sm:w-80 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3" />
          <div className="h-4 w-40 bg-slate-200/70 dark:bg-slate-800/70 rounded mb-4" />
          <div className="h-4 w-full max-w-xl bg-slate-200/60 dark:bg-slate-800/60 rounded mb-2" />
          <div className="h-4 w-3/4 max-w-lg bg-slate-200/60 dark:bg-slate-800/60 rounded mb-6" />

          {/* Counts Pills Skeleton */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>

        {/* Tab Buttons Skeleton */}
        <div className="flex items-center gap-3 mb-8 border-b border-border/60 pb-3">
          <div className="h-10 w-36 bg-primary/20 rounded-xl" />
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/80 bg-surface overflow-hidden p-4 space-y-4 shadow-xs"
            >
              <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-primary/20 rounded-full" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded" />
              </div>
              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-24 bg-primary/20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
