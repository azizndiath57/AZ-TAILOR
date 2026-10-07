"use client";

import React from "react";
import { motion } from "motion/react";
import FadeInUp from "./FadeInUp";
import CountUp from "./CountUp";
import MagneticButton from "./MagneticButton";
import styles from "../../landing.module.css";
import { useTranslations } from "next-intl";

export default function Pricing() {
  const t = useTranslations("Landing.Pricing");
  return (
    <section className="py-24 bg-surface" id="tarifs">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md text-3xl md:text-4xl font-bold tracking-tight leading-tight text-primary mb-4">
              {t('title')}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('subtitle')}
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Plan Pro */}
          <FadeInUp delay={100} className={`bg-primary text-on-primary p-8 rounded-2xl relative md:-mt-4 md:mb-4 flex flex-col ${styles.hoverLift}`}>
            <motion.div
              className="absolute -top-3 right-8 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              {t('popular')}
            </motion.div>
            <h3 className="font-headline-sm text-xl md:text-2xl font-bold mb-2">{t('proPlan')}</h3>
            <div className="flex flex-wrap items-baseline gap-x-2 mb-6">
              <span className="font-display-lg-mobile text-[32px] font-extrabold tracking-tight whitespace-nowrap"><CountUp value={4000} /> FCFA</span>
              <span className="text-primary-fixed-dim font-label-sm">/{t('monthly').toLowerCase()}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> {t('features.clientsUnl')}</li>
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> {t('features.customLogo')}</li>
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> {t('features.whatsapp')}</li>
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> {t('features.analytics')}</li>
            </ul>
            <MagneticButton href="/connexion" className="w-full bg-secondary text-on-secondary py-3 rounded-full font-label-md hover:bg-on-secondary-container transition-colors">
              {t('startTrial')}
            </MagneticButton>
          </FadeInUp>

          {/* Plan Atelier */}
          <FadeInUp delay={200} className={`bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 flex flex-col ${styles.hoverLift}`}>
            <h3 className="font-headline-sm text-xl md:text-2xl font-bold text-primary mb-2">{t('premiumPlan')}</h3>
            <div className="flex flex-wrap items-baseline gap-x-2 mb-6">
              <span className="font-display-lg-mobile text-[32px] font-extrabold tracking-tight whitespace-nowrap text-primary"><CountUp value={12000} /> FCFA</span>
              <span className="text-on-surface-variant font-label-sm">/{t('monthly').toLowerCase()}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> {t('features.ordersUnl')}</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> {t('features.employees')}</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> {t('features.multiShop')}</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> {t('features.support')}</li>
            </ul>
            <a href="https://wa.me/221778685084?text=Bonjour,%20je%20suis%20int%C3%A9ress%C3%A9%20par%20la%20formule%20Premium%20pour%20AZ-TAILOR." target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-full border border-primary text-primary font-label-md hover:bg-primary/5 transition-colors">
              {t('choosePlan')}
            </a>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
