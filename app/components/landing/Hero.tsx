"use client";

import React from "react";
import MagneticButton from "./MagneticButton";
import FadeInUp from "./FadeInUp";
import styles from "../../landing.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section 
      className="relative pt-20 md:pt-28 pb-16 px-margin-mobile md:px-margin-desktop w-full mx-auto text-center object-cover bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <FadeInUp delay={100}>
        <div className="max-w-3xl mx-auto space-y-stack-md relative z-10">
          <h1 className="font-display text-4xl md:text-6xl text-white leading-tight tracking-tight">
            Oubliez les cahiers perdus.<br className="mb-4 md:mb-6" />
            <span className="text-teal-300 block mt-2 md:mt-4">
              Gérez votre atelier avec précision.
            </span>
          </h1>
          
          <p className="font-body-lg text-body-lg text-gray-200 max-w-2xl mx-auto">
            AZ-TAILORS centralise vos mesures, vos tissus et vos paiements en un seul endroit. 
            Conçu par et pour les artisans de l&apos;élégance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <MagneticButton
              href="/connexion"
              className="w-full sm:w-auto bg-brand text-white font-label-md text-label-md px-8 py-4 rounded-full hover:bg-brand/90 transition-colors shadow-md"
            >
              Commencer gratuitement
            </MagneticButton>
            
            <Link
              href="/connexion"
              className="w-full sm:w-auto border-[1.5px] border-white text-white font-label-md text-label-md px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={300}>
        <div className={`mt-20 relative mx-auto max-w-5xl rounded-xl overflow-hidden border border-outline-variant/20 ${styles.ambientShadow} ${styles.hoverLift}`}>
          {/* Cannot use next/image with external googleusercontent without config, using img */}
          <img 
            alt="AZ-TAILORS Dashboard Mockup" 
            className="w-full h-auto object-cover rounded-xl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2DjaiV-mb2KFNwkaws7_2panfkVP5Xj2JUwnJGUOANytOhVEu79LRai40_0yLExr3GI0K9hc-tIZz6-13_-YvsY9DSsfHUl0rNsrh2jov4kGWIOPUe-vumdwOffJ0T_673eVT5gvFQJW4xypmjH1yGx_R-QeOQ3JG_eA_ssZN05M1HzrCwmUBgEA-7ahGl9ILrzHoDbfbOJHJM_JzycTpBwd5yo0c7StIs5D8Rt463qYQmwMbFTn_Dw" 
          />
        </div>
      </FadeInUp>
    </section>
  );
}
