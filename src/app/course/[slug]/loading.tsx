export default function CourseDetailLoading() {
  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-16 animate-pulse select-none">
      {/* Top Hero Header Skeleton */}
      <div className="bg-surface/90 dark:bg-slate-900/90 border-b border-border/80 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-14">
        <div className="container-main">
          {/* Breadcrumbs Skeleton */}
          <div className="h-4 w-48 rounded-md bg-surface-secondary/80 mb-5" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 rounded-full bg-primary/20" />
                <div className="h-5 w-28 rounded-full bg-surface-secondary/80" />
              </div>
              <div className="h-8 sm:h-10 w-4/5 rounded-xl bg-surface-secondary/90" />
              <div className="h-4 w-full max-w-xl rounded-md bg-surface-secondary/70" />
              <div className="flex items-center gap-4 pt-2">
                <div className="h-6 w-28 rounded-lg bg-surface-secondary/60" />
                <div className="h-6 w-24 rounded-lg bg-surface-secondary/60" />
              </div>
            </div>

            {/* Right Column (4 cols) - Sticky Purchase Panel preview */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="rounded-3xl border border-border/80 bg-surface p-6 space-y-4 shadow-md">
                <div className="aspect-video w-full rounded-2xl bg-surface-secondary/80" />
                <div className="h-8 w-32 rounded-lg bg-primary/20" />
                <div className="h-11 w-full rounded-2xl bg-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container-main py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Description Card */}
            <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="h-6 w-48 rounded-md bg-surface-secondary/80" />
              <div className="h-4 w-full rounded-md bg-surface-secondary/60" />
              <div className="h-4 w-5/6 rounded-md bg-surface-secondary/60" />
              <div className="h-4 w-4/6 rounded-md bg-surface-secondary/60" />
            </div>

            {/* Curriculum Accordion Skeleton */}
            <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-4 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-52 rounded-md bg-surface-secondary/80" />
                <div className="h-4 w-28 rounded-md bg-surface-secondary/60" />
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/70 p-4 flex items-center justify-between gap-3 bg-surface-secondary/30"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 shrink-0" />
                    <div className="h-4 w-48 rounded-md bg-surface-secondary/80" />
                  </div>
                  <div className="h-6 w-20 rounded-lg bg-surface-secondary/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
