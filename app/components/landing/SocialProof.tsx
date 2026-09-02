"use client";

import React from "react";
import FadeInUp from "./FadeInUp";

export default function SocialProof() {
  return (
    <section id="ateliers" className="py-12 bg-surface-container-low border-y border-outline-variant/10 scroll-mt-20">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <FadeInUp>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-8">
            Ils transforment la mode ivoirienne et africaine avec nous
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale">
            
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
              <span className="font-display text-xl tracking-[0.2em] uppercase text-on-surface">Christie Brown</span>
            </div>

            {/* Logo: Alfonso Kassi */}
            <div className="flex flex-col items-center justify-center hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
              <span className="material-symbols-outlined text-3xl text-on-surface">account_balance</span>
              <span className="font-display text-[12px] tracking-widest uppercase text-on-surface-variant mt-1">Alfonso Kassi</span>
            </div>

            {/* Logo: Adama Paris */}
            <div className="flex items-center justify-center gap-2 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
              <span className="font-display text-2xl font-bold text-on-surface">Adama</span>
              <span className="font-body text-sm font-light tracking-widest uppercase text-on-surface mt-1">Paris</span>
            </div>

          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
