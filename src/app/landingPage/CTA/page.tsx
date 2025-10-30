
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Make work flow with Tickly
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start tracking, collaborating, and closing tickets the easy way. No
          setup headaches — just sign up and go.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Get started — it’s free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

