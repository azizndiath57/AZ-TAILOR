"use client";

import React from "react";
import FadeInUp from "./FadeInUp";
import styles from "../../landing.module.css";
import { useTranslations } from "next-intl";

function Logos({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.marqueeGroup} aria-hidden={hidden || undefined}>
      {/* Logo: Gilles Touré */}
      <div className="flex flex-col items-center justify-center hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
        <span className="font-display text-3xl font-bold italic tracking-widest text-on-surface">GT</span>
        <span className="font-body text-[10px] tracking-widest uppercase text-on-surface-variant mt-1">Gilles Touré</span>
      </div>

      {/* Logo: Sophie Zinga */}
      <div className="flex flex-col items-center justify-center hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
        <span className="font-display text-3xl font-light tracking-wide text-on-surface">SZ</span>
        <span className="font-body text-[10px] tracking-widest uppercase text-on-surface-variant mt-1">Sophie Zinga</span>
      </div>

      {/* Logo: Christie Brown */}
      <div className="flex flex-col items-center justify-center hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
        <span className="font-display text-xl tracking-[0.2em] uppercase text-on-surface whitespace-nowrap">Christie Brown</span>
      </div>

      {/* Logo: Alfonso Kassi */}
      <div className="flex flex-col items-center justify-center hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
        <span aria-hidden="true" className="material-symbols-outlined text-3xl text-on-surface">account_balance</span>
        <span className="font-display text-[12px] tracking-widest uppercase text-on-surface-variant mt-1 whitespace-nowrap">Alfonso Kassi</span>
      </div>

      {/* Logo: Adama Paris */}
      <div className="flex items-center justify-center gap-2 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
        <span className="font-display text-2xl font-bold text-on-surface">Adama</span>
        <span className="font-body text-sm font-light tracking-widest uppercase text-on-surface mt-1">Paris</span>
      </div>
    </div>
  );
}

export default function SocialProof() {
  const t = useTranslations("Landing.SocialProof");
  return (
    <section id="ateliers" className="py-12 bg-surface-container-low border-y border-outline-variant/10 scroll-mt-20">
      <div className="max-w-container-max mx-auto text-center">
        <FadeInUp>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-8 px-margin-mobile md:px-margin-desktop">
            {t('title')}
          </p>
          <div className={`${styles.marquee} opacity-70 grayscale`}>
            <div className={styles.marqueeTrack}>
              <Logos />
              <Logos hidden />
              <Logos hidden />
              <Logos hidden />
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
