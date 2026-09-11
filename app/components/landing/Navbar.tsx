"use client";

import React, { useState } from "react";
import Link from "next/link";
import MagneticButton from "./MagneticButton";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("Landing.Navbar");

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md border-b border-outline-variant/10 shadow-md">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link href="/" className="flex items-center gap-4 group">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="9.5" cy="9.5" r="1.5" fill="currentColor" />
            <circle cx="14.5" cy="9.5" r="1.5" fill="currentColor" />
            <circle cx="9.5" cy="14.5" r="1.5" fill="currentColor" />
            <circle cx="14.5" cy="14.5" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
            AZ-TAILOR
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            className="font-label-md text-label-md text-secondary font-bold border-b-2 border-secondary py-1"
            href="#solutions"
          >
            {t('solutions')}
          </Link>
          <Link
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-1 hover:-translate-y-0.5 duration-200"
            href="#tarifs"
          >
            {t('tarifs')}
          </Link>
          <Link
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-1 hover:-translate-y-0.5 duration-200"
            href="#ateliers"
          >
            {t('ateliers')}
          </Link>
          <Link
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-1 hover:-translate-y-0.5 duration-200"
            href="#blog"
          >
            {t('blog')}
          </Link>
        </div>

        {/* Action Buttons (Desktop) & Hamburger (Mobile) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link
            className="hidden md:inline-flex font-label-md text-label-md text-primary hover:bg-surface-container-low px-4 py-2 rounded-full transition-all duration-300"
            href="/connexion"
          >
            {t('login')}
          </Link>
          <div className="hidden md:block">
            <MagneticButton
              href="/connexion"
              className="bg-secondary text-on-secondary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-on-secondary-container transition-colors shadow-sm"
            >
              {t('startFree')}
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-primary focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant/10 shadow-lg py-4 px-margin-mobile flex flex-col gap-4 animate-[slide-down_0.3s_ease-out]">
          <Link href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-primary font-bold">{t('solutions')}</Link>
          <Link href="#tarifs" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant">{t('tarifs')}</Link>
          <Link href="#ateliers" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant">{t('ateliers')}</Link>
          <Link href="#blog" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-on-surface-variant">{t('blog')}</Link>
          <hr className="border-outline-variant/20 my-2" />
          <div className="flex justify-center my-2">
            <LanguageSwitcher />
          </div>
          <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-primary font-bold text-center">{t('login')}</Link>
          <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)} className="bg-secondary text-on-secondary text-center font-bold py-3 rounded-full mt-2">{t('startFree')}</Link>
        </div>
      )}
    </nav>
  );
}
