"use client";

import Header from "./landing-page/header/page";
import Hero from "./landing-page/hero/page";
import Features from "./landing-page/features/page";
import CTA from "./landing-page/cta/page";
import Footer from "./landing-page/footer/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
