import Link from "next/link";

export default function Header() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur [backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">Tickly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm px-4 py-2 border border-border hover:border-primary/50 rounded-lg bg-primary/10 hover:bg-primary/20 font-medium text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
