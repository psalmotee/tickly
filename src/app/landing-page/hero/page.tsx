import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-accent blur-3xl" />

      {/* Wavy background */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#10b981"
            fillOpacity="1"
            d="M0,128L48,138.7C96,149,192,171,288,154.7C384,139,480,85,576,106.7C672,128,768,224,864,256C960,288,1056,256,1152,234.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col gap-6 items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">
              Simple, smart ticket management
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-3xl">
            Keep every task on track with{" "}
            <span className="text-primary">Tickly</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Tickly helps your team stay organized and connected. Create, assign,
            and resolve tickets without the clutter. Fast, easy, and actually
            fun to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get started - it’s free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-medium text-foreground bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-colors"
            >
              See how it works
            </Link>
          </div>

          {/* Feature boxes */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
            {[
              {
                title: "Create & Track",
                desc: "Open, assign, and follow tickets with no fuss.",
              },
              {
                title: "Real-time Sync",
                desc: "Everyone stays updated as things move.",
              },
              {
                title: "Team-Friendly",
                desc: "Built for smooth collaboration and quick wins.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl shadow-md bg-card p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-foreground text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}