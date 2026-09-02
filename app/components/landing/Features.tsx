"use client";

import React from "react";
import FadeInUp from "./FadeInUp";
import styles from "../../landing.module.css";

export default function Features() {
  return (
    <>
      {/* Problems Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="solutions">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">
              Ce que vous perdez sans <span className="text-secondary">AZ-TAILORS</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Gérer un atelier avec du papier et des fichiers Excel éparpillés limite votre croissance.
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeInUp delay={100} className={`bg-error-container/30 p-8 rounded-2xl border border-error-container ${styles.hoverLift}`}>
            <span className="material-symbols-outlined text-error text-4xl mb-4">menu_book</span>
            <h3 className="font-label-lg text-label-lg font-bold text-primary mb-2">Mesures égarées</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Les carnets se perdent, les feuilles volent. Résultat : des clients mécontents et du tissu gâché.</p>
          </FadeInUp>
          
          <FadeInUp delay={200} className={`bg-error-container/30 p-8 rounded-2xl border border-error-container ${styles.hoverLift}`}>
            <span className="material-symbols-outlined text-error text-4xl mb-4">account_balance_wallet</span>
            <h3 className="font-label-lg text-label-lg font-bold text-primary mb-2">Acomptes oubliés</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Difficile de savoir qui a payé quoi sans un registre financier clair et centralisé.</p>
          </FadeInUp>
          
          <FadeInUp delay={300} className={`bg-error-container/30 p-8 rounded-2xl border border-error-container ${styles.hoverLift}`}>
            <span className="material-symbols-outlined text-error text-4xl mb-4">schedule</span>
            <h3 className="font-label-lg text-label-lg font-bold text-primary mb-2">Retards de livraison</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Pas de suivi de production signifie des commandes en retard et un stress constant.</p>
          </FadeInUp>
        </div>
      </section>

      {/* Features Showcase */}
      <section className={`py-24 ${styles.bgPattern}`}>
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-sm text-sm font-bold uppercase tracking-wider">La Solution</span>
              <h2 className="font-headline-md text-headline-md text-primary mt-6 mb-4">
                Tout votre atelier, <br className="hidden md:block" />dans votre poche.
              </h2>
            </div>
          </FadeInUp>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeInUp delay={100} className="order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-outline-variant/20 bg-surface-container-lowest p-6 min-h-[350px] flex gap-4">
                  {/* Flat design mockup: Carnet de mesures */}
                  <div className="w-1/3 border-r border-outline-variant/20 pr-4 space-y-4">
                    <div className="w-full h-8 bg-outline-variant/20 rounded-md"></div>
                    <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-2 bg-primary/40 rounded"></div>
                        <div className="w-2/3 h-2 bg-primary/20 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-outline-variant/20 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-2 bg-outline-variant/30 rounded"></div>
                        <div className="w-2/3 h-2 bg-outline-variant/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/3 space-y-6">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                        <div className="space-y-2">
                          <div className="w-24 h-3 bg-outline-variant/40 rounded"></div>
                          <div className="w-16 h-2 bg-outline-variant/30 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-container-low rounded-lg p-3 space-y-2 border border-outline-variant/10">
                        <div className="w-12 h-2 bg-outline-variant/40 rounded"></div>
                        <div className="w-10 h-4 bg-primary/50 rounded"></div>
                      </div>
                      <div className="bg-surface-container-low rounded-lg p-3 space-y-2 border border-outline-variant/10">
                        <div className="w-16 h-2 bg-outline-variant/40 rounded"></div>
                        <div className="w-12 h-4 bg-primary/50 rounded"></div>
                      </div>
                      <div className="bg-surface-container-low rounded-lg p-3 space-y-2 border border-outline-variant/10">
                        <div className="w-14 h-2 bg-outline-variant/40 rounded"></div>
                        <div className="w-9 h-4 bg-primary/50 rounded"></div>
                      </div>
                      <div className="bg-surface-container-low rounded-lg p-3 space-y-2 border border-outline-variant/10">
                        <div className="w-10 h-2 bg-outline-variant/40 rounded"></div>
                        <div className="w-14 h-4 bg-primary/50 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
                </div>
              </FadeInUp>
              <FadeInUp delay={200} className="order-1 lg:order-2 space-y-6">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">straighten</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Carnet de mesures numérique</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Enregistrez jusqu&apos;à 30 points de mesure par client. Fini les erreurs de coupe. Retrouvez le profil d&apos;un client en une seconde grâce à la recherche instantanée.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-primary font-label-md"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> Profils clients détaillés</li>
                  <li className="flex items-center gap-3 text-primary font-label-md"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> Historique des mensurations</li>
                  <li className="flex items-center gap-3 text-primary font-label-md"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> Photos des modèles souhaités</li>
                </ul>
              </FadeInUp>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeInUp delay={100} className="space-y-6">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">receipt_long</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Facturation & WhatsApp</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Générez des factures professionnelles en un clic (format A4 ou mobile). Relancez vos clients pour le reste à payer directement via un message WhatsApp pré-rempli.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-primary font-label-md"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> Calcul automatique des restes à payer</li>
                  <li className="flex items-center gap-3 text-primary font-label-md"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> Factures avec votre logo</li>
                  <li className="flex items-center gap-3 text-primary font-label-md"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> Intégration WhatsApp</li>
                </ul>
              </FadeInUp>
              <FadeInUp delay={200}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-outline-variant/20 bg-surface-container-lowest p-6 min-h-[350px] flex flex-col gap-4">
                  {/* Flat design mockup: Facture & WhatsApp */}
                  <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-lg">receipt_long</span>
                      </div>
                      <div className="space-y-2">
                        <div className="w-24 h-3 bg-outline-variant/40 rounded"></div>
                        <div className="w-16 h-2 bg-outline-variant/30 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 rounded-full bg-secondary-container/50 flex items-center justify-center">
                      <div className="w-12 h-2 bg-secondary/60 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                      <div className="w-32 h-2 bg-outline-variant/50 rounded"></div>
                      <div className="w-16 h-3 bg-outline-variant/60 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                      <div className="w-24 h-2 bg-outline-variant/50 rounded"></div>
                      <div className="w-16 h-3 bg-outline-variant/60 rounded"></div>
                    </div>
                  </div>

                  <div className="mt-auto relative z-10 translate-y-2 translate-x-2">
                    <div className="ml-auto w-4/5 bg-[#e7ffdb] rounded-2xl rounded-tr-none p-4 shadow-md border border-[#d3e5c9]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-green-600 text-sm">chat</span>
                        <div className="w-20 h-2 bg-green-700/40 rounded"></div>
                      </div>
                      <div className="w-full h-2 bg-green-700/30 rounded mb-2"></div>
                      <div className="w-5/6 h-2 bg-green-700/30 rounded mb-2"></div>
                      <div className="w-2/3 h-2 bg-green-700/30 rounded"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none"></div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
