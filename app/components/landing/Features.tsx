"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import FadeInUp, { EASE_OUT } from "./FadeInUp";
import CountUp from "./CountUp";
import styles from "../../landing.module.css";
import { useTranslations } from "next-intl";

// Mockup choreography: the parent staggers, each piece picks its own entrance
const mockup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const bar: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};
const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 16 } },
};
const rise: Variants = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};
const slide: Variants = {
  hidden: { x: -24, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};
const bubble: Variants = {
  hidden: { scale: 0.5, y: 30, opacity: 0 },
  show: { scale: 1, y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 14, delay: 0.5 } },
};

const bullets: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const bullet: Variants = {
  hidden: { x: -16, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

const viewport = { once: true, amount: 0.4 };

function Bar({ className }: { className: string }) {
  return <motion.div variants={bar} className={`origin-left ${className}`} />;
}

function Stitch() {
  return (
    <motion.div
      aria-hidden="true"
      className={`${styles.stitch} w-32 mx-auto mt-6`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }}
    />
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <motion.ul className="space-y-3" variants={bullets} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {items.map((item) => (
        <motion.li key={item} variants={bullet} className="flex items-center gap-3 text-primary font-label-md">
          <motion.span variants={pop} className="material-symbols-outlined text-secondary text-xl">check_circle</motion.span> {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

const measurements = [
  { label: "w-12", value: 92 },
  { label: "w-16", value: 78 },
  { label: "w-14", value: 64 },
  { label: "w-10", value: 104 },
];

export default function Features() {
  const t = useTranslations("Landing.Features");

  const problems = [
    { icon: "menu_book", title: t('card1Title'), text: t('card1Text') },
    { icon: "account_balance_wallet", title: t('card2Title'), text: t('card2Text') },
    { icon: "schedule", title: t('card3Title'), text: t('card3Text') },
  ];

  return (
    <>
      {/* Problems Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto scroll-mt-20" id="solutions">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md text-3xl md:text-4xl font-bold tracking-tight leading-tight text-primary mb-4">
              {t('whatYouLose')}<span className="text-secondary">AZ-TAILOR</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('whatYouLoseSubtitle')}
            </p>
            <Stitch />
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.icon}
              className={`bg-error-container/30 p-8 rounded-2xl border border-error-container ${styles.hoverLift}`}
              initial={{ opacity: 0, y: 50, rotate: index === 1 ? 0 : index === 0 ? -4 : 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: index * 0.12, ease: EASE_OUT }}
            >
              <motion.span
                className="material-symbols-outlined text-error text-4xl mb-4 inline-block"
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.3 + index * 0.12 }}
              >
                {problem.icon}
              </motion.span>
              <h3 className="font-label-lg text-label-lg font-bold text-primary mb-2">{problem.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{problem.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Showcase */}
      <section className={`py-24 overflow-hidden ${styles.bgPattern}`}>
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-sm text-sm font-bold uppercase tracking-wider">{t('solutionLabel')}</span>
              <h2 className="font-headline-md text-3xl md:text-4xl font-bold tracking-tight leading-tight text-primary mt-6 mb-4">
                {t('solutionTitle1')} <br className="hidden md:block" />{t('solutionTitle2')}
              </h2>
              <Stitch />
            </div>
          </FadeInUp>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeInUp delay={100} className="order-2 lg:order-1">
                <motion.div
                  className="relative rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest p-6 min-h-[350px] flex gap-4"
                  variants={mockup}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport}
                >
                  {/* Flat design mockup: Carnet de mesures */}
                  <div className="w-1/3 border-r border-outline-variant/20 pr-4 space-y-4">
                    <Bar className="w-full h-8 bg-outline-variant/20 rounded-md" />
                    <motion.div variants={slide} className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-2 bg-primary/40 rounded"></div>
                        <div className="w-2/3 h-2 bg-primary/20 rounded"></div>
                      </div>
                    </motion.div>
                    <motion.div variants={slide} className="flex items-center gap-3 p-2">
                      <div className="w-8 h-8 rounded-full bg-outline-variant/10 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-2 bg-outline-variant/20 rounded"></div>
                        <div className="w-2/3 h-2 bg-outline-variant/10 rounded"></div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-2/3 space-y-6">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                      <div className="flex items-center gap-3">
                        <motion.div variants={pop} className="w-12 h-12 rounded-full bg-primary/20" />
                        <div className="space-y-2">
                          <Bar className="w-24 h-3 bg-outline-variant/40 rounded" />
                          <Bar className="w-16 h-2 bg-outline-variant/30 rounded" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {measurements.map((measurement) => (
                        <motion.div
                          key={measurement.value}
                          variants={rise}
                          className="bg-surface-container-low rounded-lg p-3 space-y-2 border border-outline-variant/10"
                        >
                          <div className={`${measurement.label} h-2 bg-outline-variant/40 rounded`}></div>
                          <div className="font-display text-2xl font-bold leading-none text-primary">
                            <CountUp value={measurement.value} /> <span className="text-sm text-on-surface-variant">cm</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FadeInUp>
              <FadeInUp delay={200} className="order-1 lg:order-2 space-y-6">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">straighten</span>
                </div>
                <h3 className="font-headline-sm text-xl md:text-2xl font-bold text-primary">{t('feature1Title')}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t('feature1Text')}
                </p>
                <Bullets items={[t('feature1Bullet1'), t('feature1Bullet2'), t('feature1Bullet3')]} />
              </FadeInUp>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeInUp delay={100} className="space-y-6">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">receipt_long</span>
                </div>
                <h3 className="font-headline-sm text-xl md:text-2xl font-bold text-primary">{t('feature2Title')}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t('feature2Text')}
                </p>
                <Bullets items={[t('feature2Bullet1'), t('feature2Bullet2'), t('feature2Bullet3')]} />
              </FadeInUp>
              <FadeInUp delay={200}>
                <motion.div
                  className="relative rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest p-6 min-h-[350px] flex flex-col gap-4"
                  variants={mockup}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport}
                >
                  {/* Flat design mockup: Facture & WhatsApp */}
                  <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                    <div className="flex items-center gap-3">
                      <motion.div variants={pop} className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-lg">receipt_long</span>
                      </motion.div>
                      <div className="space-y-2">
                        <Bar className="w-24 h-3 bg-outline-variant/40 rounded" />
                        <Bar className="w-16 h-2 bg-outline-variant/30 rounded" />
                      </div>
                    </div>
                    <motion.div variants={pop} className="w-20 h-6 rounded-full bg-secondary-container/50 flex items-center justify-center">
                      <div className="w-12 h-2 bg-secondary/60 rounded"></div>
                    </motion.div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <motion.div variants={slide} className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                      <div className="w-32 h-2 bg-outline-variant/50 rounded"></div>
                      <div className="w-16 h-3 bg-outline-variant/60 rounded"></div>
                    </motion.div>
                    <motion.div variants={slide} className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                      <div className="w-24 h-2 bg-outline-variant/50 rounded"></div>
                      <div className="w-16 h-3 bg-outline-variant/60 rounded"></div>
                    </motion.div>
                  </div>

                  <div className="mt-auto relative z-10 translate-y-2 translate-x-2">
                    <motion.div variants={bubble} className="ml-auto w-4/5 origin-bottom-right bg-[#e7ffdb] rounded-2xl rounded-tr-none p-4 border border-[#d3e5c9]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-green-600 text-sm">chat</span>
                        <div className="w-20 h-2 bg-green-700/40 rounded"></div>
                      </div>
                      <div className="w-full h-2 bg-green-700/30 rounded mb-2"></div>
                      <div className="w-5/6 h-2 bg-green-700/30 rounded mb-2"></div>
                      <div className="flex items-center justify-between">
                        <div className="w-2/3 h-2 bg-green-700/30 rounded"></div>
                        <motion.span
                          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.3 } } }}
                          className="material-symbols-outlined text-sky-500 text-base leading-none"
                        >
                          done_all
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
