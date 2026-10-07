"use client";

import React, { useId, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import MagneticButton from "./MagneticButton";
import CountUp from "./CountUp";
import { EASE_OUT } from "./FadeInUp";
import styles from "../../landing.module.css";
import Link from "next/link";
import { useTranslations } from "next-intl";

const cards: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

// Each word slides up from behind its own mask
function SplitWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.25em] last:mr-0"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%", rotate: 6 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: delay + index * 0.09, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Rule({ origin }: { origin: "origin-left" | "origin-right" }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`h-px w-10 md:w-16 bg-brand ${origin}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
    />
  );
}

export default function Hero() {
  const t = useTranslations("Landing.Hero");
  const tFeatures = useTranslations("Landing.Features");
  const tPricing = useTranslations("Landing.Pricing");
  const maskId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  // Background drifts slower than the content
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  // The dashboard rises from a tilted plane as it scrolls into view
  const { scrollYProgress: mockupProgress } = useScroll({ target: mockupRef, offset: ["start end", "center center"] });
  const mockupSpring = useSpring(mockupProgress, { stiffness: 120, damping: 26 });
  const rotateX = useTransform(mockupSpring, [0, 1], [24, 0]);
  const scale = useTransform(mockupSpring, [0, 1], [0.88, 1]);

  const highlights = [
    { icon: "group", label: tFeatures('feature1Bullet1') },
    { icon: "straighten", label: tFeatures('feature1Bullet2') },
    { icon: "receipt_long", label: tFeatures('feature2Bullet2') },
    { icon: "chat", label: tFeatures('feature2Bullet3') },
  ];

  const plans = [
    { price: 4000, label: tPricing('proPlan') },
    { price: 12000, label: tPricing('premiumPlan') },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-tertiary pt-32 md:pt-44 pb-16 px-margin-mobile md:px-margin-desktop w-full mx-auto text-center"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[10%] h-[120%] bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/hero-banner.jpg')", y: backgroundY }}
        initial={{ scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: EASE_OUT }}
      />
      <div className="absolute inset-0 bg-tertiary/90 z-0"></div>

      {/* Sewing thread stitched across the hero */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        fill="none"
      >
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <motion.path
            d="M-20 470 C 200 330, 380 580, 620 440 S 1000 270, 1180 420 S 1400 330, 1470 380"
            stroke="white"
            strokeWidth="12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
        </mask>
        <path
          d="M-20 470 C 200 330, 380 580, 620 440 S 1000 270, 1180 420 S 1400 330, 1470 380"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeDasharray="12 9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.45"
          mask={`url(#${maskId})`}
        />
      </svg>

      <div className="max-w-4xl mx-auto space-y-stack-md relative z-10">
        <div className="flex items-center justify-center gap-4">
          <Rule origin="origin-right" />
          <motion.span
            className="italic font-medium text-brand text-xl md:text-2xl tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          >
            AZ-TAILOR
          </motion.span>
          <Rule origin="origin-left" />
        </div>

        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[1.1] tracking-tight">
          <SplitWords text={t('title1')} delay={0.2} />
          <span className="text-brand block mt-2">
            <SplitWords text={t('title2')} delay={0.55} />
          </span>
        </h1>

        <motion.p
          className="font-body-lg text-lg text-white/75 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE_OUT }}
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE_OUT }}
        >
          <MagneticButton
            href="/connexion"
            className="w-full sm:w-auto bg-brand text-white font-label-md font-bold px-8 py-4 rounded-full hover:bg-secondary transition-colors"
          >
            {t('startFree')}
          </MagneticButton>

          <Link
            href="/connexion"
            className="w-full sm:w-auto border-[1.5px] border-white/40 text-white font-label-md font-bold px-8 py-4 rounded-full hover:border-white hover:bg-white/10 transition-colors"
          >
            {t('demo')}
          </Link>
        </motion.div>
      </div>

      <div ref={mockupRef} className="mt-16 relative z-10 mx-auto max-w-4xl [perspective:1400px]">
        <motion.div
          className="rounded-2xl overflow-hidden border border-white/15 origin-bottom"
          style={{ rotateX, scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          {/* Cannot use next/image with external googleusercontent without config, using img */}
          <img
            alt="AZ-TAILOR Dashboard Mockup"
            className="w-full h-auto object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2DjaiV-mb2KFNwkaws7_2panfkVP5Xj2JUwnJGUOANytOhVEu79LRai40_0yLExr3GI0K9hc-tIZz6-13_-YvsY9DSsfHUl0rNsrh2jov4kGWIOPUe-vumdwOffJ0T_673eVT5gvFQJW4xypmjH1yGx_R-QeOQ3JG_eA_ssZN05M1HzrCwmUBgEA-7ahGl9ILrzHoDbfbOJHJM_JzycTpBwd5yo0c7StIs5D8Rt463qYQmwMbFTn_Dw"
          />
        </motion.div>
      </div>

      {/* Feature cards */}
      <motion.ul
        className="relative z-10 mt-10 mx-auto max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        variants={cards}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {highlights.map((highlight, index) => {
          const isFeatured = index === 1;
          return (
            <motion.li
              key={highlight.icon}
              variants={card}
              className={`rounded-2xl border px-4 py-6 flex flex-col items-center gap-3 ${styles.hoverLift} ${
                isFeatured ? "bg-secondary border-secondary text-white" : "bg-white border-white text-primary"
              }`}
            >
              <span
                aria-hidden="true"
                className={`material-symbols-outlined h-12 w-12 rounded-full flex items-center justify-center ${
                  isFeatured ? "bg-white/15 text-white" : "bg-secondary-container text-secondary"
                }`}
              >
                {highlight.icon}
              </span>
              <span className="font-label-md text-sm font-bold leading-snug">{highlight.label}</span>
              <span aria-hidden="true" className={`h-0.5 w-10 rounded-full ${isFeatured ? "bg-white/40" : "bg-outline-variant"}`}></span>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Plans bar */}
      <motion.div
        className="relative z-10 mt-4 mx-auto max-w-4xl rounded-2xl border border-white/15 bg-white/5 p-5 md:px-8 flex flex-col md:flex-row items-center gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <dl className="grid grid-cols-2 flex-1 w-full divide-x divide-white/15">
          {plans.map((plan) => (
            <div key={plan.label} className="px-2 flex flex-col-reverse gap-1">
              <dt className="text-xs md:text-sm text-white/60">{plan.label}</dt>
              <dd className="text-white font-extrabold text-xl md:text-3xl tracking-tight whitespace-nowrap">
                <CountUp value={plan.price} /> <span className="text-[10px] md:text-xs font-medium text-white/60">FCFA</span>
              </dd>
            </div>
          ))}
        </dl>
        <MagneticButton
          href="/connexion"
          className="w-full md:w-auto bg-brand text-white font-label-md font-bold px-8 py-4 rounded-xl hover:bg-secondary transition-colors"
        >
          <span className="flex items-center gap-2">
            {t('startFree')}
            <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_forward</span>
          </span>
        </MagneticButton>
      </motion.div>

      <motion.p
        className="relative z-10 text-white/70 text-sm mt-10 font-medium flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-brand">verified</span>
        {t('trial')}
      </motion.p>
    </section>
  );
}
