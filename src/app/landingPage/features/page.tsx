import { Zap, ChartColumnDecreasing, Handshake } from "lucide-vue-next";

export default function Features() {
  return (
    <section id="features" className="bg-secondary/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What makes Tickly different
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lightweight, clear, and flexible — Tickly gives your team everything
            you need to stay on top of work, not buried under it.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Instant Ticketing",
              description: "Create tickets in seconds and move faster together",
              icon: Zap,
            },
            {
              title: "Smart Status",
              description:
                "Know what’s happening at a glance with clear visuals",
              icon: ChartColumnDecreasing,
            },
            {
              title: "Team Harmony",
              description:
                "Keep everyone aligned with shared visibility and updates",
              icon: Handshake,
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-background p-6 hover:border-primary/50 transition-colors"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
