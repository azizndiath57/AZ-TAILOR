"use client";

import React from "react";
import Link from "next/link";
import FadeInUp from "./FadeInUp";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Landing.Footer");
  return (
    <footer id="blog" className="bg-tertiary text-on-tertiary pt-24 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <FadeInUp className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6">
              {/* Cannot use next/image with external googleusercontent without config, using img */}
              <img 
                alt="AZ-TAILOR Logo" 
                className="h-10 w-auto brightness-0 invert" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPCefO8PyzbTxUOQCr0tC4ALkSNYcKjW5bsq10GxZaKRnmr3e36tn8wWUxemYbZMwhyum7XPZcqT3bicCRbt3luOiXBScNont8ngmdNV2_HdWs2RgTkPEzJRg5EWPMCfcLNqkfE_-En77c7fnnro3RymBfGKgIUIkx1BzYr7xQYhAPIxMDobqKEq-FglRt9aVqbmeC0_17N2YFxn_Mwmruv7dJ88V1Ri8s8DGVxXNI3TDjTruC6Br7Lw" 
              />
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight">
                AZ-TAILOR
              </span>
            </Link>
            <p className="font-body-md text-tertiary-fixed-dim max-w-sm">
              {t('description')}
            </p>
          </div>
          
          <div>
            <h4 className="font-label-lg font-bold mb-6">{t('product')}</h4>
            <ul className="space-y-4">
              <li><Link href="#solutions" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">{t('features')}</Link></li>
              <li><Link href="#tarifs" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">{t('pricing')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-label-lg font-bold mb-6">{t('company')}</h4>
            <ul className="space-y-4">
              <li><Link href="/a-propos" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">{t('about')}</Link></li>
              <li><a href="https://wa.me/221778685084" target="_blank" rel="noopener noreferrer" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">{t('contact')}</a></li>
              <li><Link href="/politique-de-confidentialite" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">{t('privacy')}</Link></li>
              <li><Link href="/cgv" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">{t('terms')}</Link></li>
            </ul>
          </div>
        </FadeInUp>
        
        <div className="pt-8 border-t border-tertiary-fixed-dim/20 flex justify-center items-center gap-4">
          <p className="text-tertiary-fixed-dim font-body-sm text-center">
            © {new Date().getFullYear()} AZ-TAILOR (EI). {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
