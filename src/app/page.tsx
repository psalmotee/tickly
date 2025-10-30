"use client";

import Header from "./landingPage/header/page";
import Hero from "./landingPage/hero/page";
import Features from "./landingPage/features/page";
import CTA from "./landingPage/CTA/page";
import Footer from "./landingPage/footer/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
