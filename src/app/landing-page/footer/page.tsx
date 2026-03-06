export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="font-semibold text-foreground">Tickly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Tickly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}