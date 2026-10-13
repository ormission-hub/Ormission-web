export default function BooksLoading() {
  return (
    <div className="container-main py-10 sm:py-14 animate-pulse select-none space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-xl bg-surface-secondary/90" />
        <div className="h-4 w-72 rounded-md bg-surface-secondary/60" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/70 bg-surface p-4 space-y-4 shadow-sm"
          >
            <div className="h-48 w-full rounded-xl bg-surface-secondary/80" />
            <div className="h-5 w-3/4 rounded-md bg-surface-secondary/80" />
            <div className="h-3.5 w-1/2 rounded-md bg-surface-secondary/60" />
            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <div className="h-6 w-16 rounded-md bg-primary/20" />
              <div className="h-8 w-24 rounded-xl bg-primary/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
