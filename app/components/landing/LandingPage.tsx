"use client";

import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import Footer from "./Footer";
import styles from "../../landing.module.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "latin-ext"],
});

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 h-[3px] origin-left z-[60] bg-brand"
      style={{ scaleX }}
    />
  );
}

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`${jakarta.variable} ${styles.theme} bg-background text-on-background min-h-screen font-body overflow-x-hidden selection:bg-secondary/20 selection:text-secondary`}>
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <Features />
          {/* La section Testimonials (et le lien « Ateliers » de la Navbar) reviendra avec les vrais témoignages */}
          <Pricing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
