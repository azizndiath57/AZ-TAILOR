"use client";

import React from "react";
import FadeInUp from "./FadeInUp";
import MagneticButton from "./MagneticButton";
import styles from "../../landing.module.css";
import Link from "next/link";

export default function Pricing() {
  return (
    <section className="py-24 bg-surface" id="tarifs">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">
              Des tarifs simples, sans surprise
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Commencez gratuitement, évoluez selon vos besoins.
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan Gratuit */}
          <FadeInUp delay={100} className={`bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col ${styles.hoverLift}`}>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Débutant</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display-lg-mobile text-[48px] text-primary">0 FCFA</span>
              <span className="text-on-surface-variant font-label-sm">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Jusqu&apos;à 20 clients</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Gestion des commandes basique</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Factures standards</li>
            </ul>
            <Link href="/connexion" className="block text-center w-full py-3 rounded-full border border-primary text-primary font-label-md hover:bg-primary/5 transition-colors">
              Commencer
            </Link>
          </FadeInUp>

          {/* Plan Pro */}
          <FadeInUp delay={200} className={`bg-primary text-on-primary p-8 rounded-2xl shadow-xl relative transform md:-translate-y-4 flex flex-col ${styles.hoverLift}`}>
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider">
              Populaire
            </div>
            <h3 className="font-headline-sm text-headline-sm mb-2">Professionnel</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display-lg-mobile text-[48px]">5 000 FCFA</span>
              <span className="text-primary-fixed-dim font-label-sm">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> Clients illimités</li>
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> Factures avec votre logo</li>
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> Relances WhatsApp Auto</li>
              <li className="flex items-center gap-3 font-body-sm"><span className="material-symbols-outlined text-secondary text-xl">check</span> Statistiques avancées</li>
            </ul>
            <MagneticButton href="/connexion" className="w-full bg-secondary text-on-secondary py-3 rounded-full font-label-md hover:bg-on-secondary-container transition-colors shadow-md">
              Essai gratuit 14 jours
            </MagneticButton>
          </FadeInUp>

          {/* Plan Atelier */}
          <FadeInUp delay={300} className={`bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col ${styles.hoverLift}`}>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Grand Atelier</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display-lg-mobile text-[48px] text-primary">15 000 FCFA</span>
              <span className="text-on-surface-variant font-label-sm">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Tout de Pro</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Gestion multi-employés</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Suivi d&apos;inventaire tissu</li>
              <li className="flex items-center gap-3 text-on-surface-variant font-body-sm"><span className="material-symbols-outlined text-primary text-xl">check</span> Support prioritaire</li>
            </ul>
            <a href="https://wa.me/221778685084?text=Bonjour,%20je%20suis%20int%C3%A9ress%C3%A9%20par%20la%20formule%20Grand%20Atelier%20pour%20AZ-TAILORS." target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-full border border-primary text-primary font-label-md hover:bg-primary/5 transition-colors">
              Nous contacter
            </a>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
