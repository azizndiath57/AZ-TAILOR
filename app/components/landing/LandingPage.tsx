"use client";

import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import SocialProof from "./SocialProof";
import Features from "./Features";
import Pricing from "./Pricing";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen font-body overflow-x-hidden selection:bg-secondary/20 selection:text-secondary">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
