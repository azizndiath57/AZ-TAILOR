"use client";

import React from "react";
import Link from "next/link";
import FadeInUp from "./FadeInUp";

export default function Footer() {
  return (
    <footer id="blog" className="bg-tertiary text-on-tertiary pt-24 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <FadeInUp className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6">
              {/* Cannot use next/image with external googleusercontent without config, using img */}
              <img 
                alt="AZ-TAILORS Logo" 
                className="h-10 w-auto brightness-0 invert" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPCefO8PyzbTxUOQCr0tC4ALkSNYcKjW5bsq10GxZaKRnmr3e36tn8wWUxemYbZMwhyum7XPZcqT3bicCRbt3luOiXBScNont8ngmdNV2_HdWs2RgTkPEzJRg5EWPMCfcLNqkfE_-En77c7fnnro3RymBfGKgIUIkx1BzYr7xQYhAPIxMDobqKEq-FglRt9aVqbmeC0_17N2YFxn_Mwmruv7dJ88V1Ri8s8DGVxXNI3TDjTruC6Br7Lw" 
              />
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight">
                AZ-TAILORS
              </span>
            </Link>
            <p className="font-body-md text-tertiary-fixed-dim max-w-sm">
              L&apos;outil de gestion nouvelle génération pour les ateliers de couture sur-mesure exigeants.
            </p>
          </div>
          
          <div>
            <h4 className="font-label-lg font-bold mb-6">Produit</h4>
            <ul className="space-y-4">
              <li><Link href="#solutions" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">Fonctionnalités</Link></li>
              <li><Link href="#tarifs" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">Tarifs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-label-lg font-bold mb-6">Entreprise</h4>
            <ul className="space-y-4">
              <li><Link href="/a-propos" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">À propos</Link></li>
              <li><a href="https://wa.me/221778685084" target="_blank" rel="noopener noreferrer" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">Contact</a></li>
              <li><Link href="/politique-de-confidentialite" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">Politique de confidentialité</Link></li>
              <li><Link href="/cgv" className="text-tertiary-fixed-dim hover:text-white transition-colors font-body-sm">CONDITIONS GÉNÉRALES DE VENTE</Link></li>
            </ul>
          </div>
        </FadeInUp>
        
        <div className="pt-8 border-t border-tertiary-fixed-dim/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-tertiary-fixed-dim font-body-sm">
            © {new Date().getFullYear()} AZ-TAILORS. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/abdu.qw/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-tertiary-fixed-dim/10 flex items-center justify-center hover:bg-secondary transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://www.instagram.com/abdaz_96/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-tertiary-fixed-dim/10 flex items-center justify-center hover:bg-secondary transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://wa.me/221778685084" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-tertiary-fixed-dim/10 flex items-center justify-center hover:bg-secondary transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.898-4.45 9.898-9.898 0-5.448-4.45-9.898-9.898-9.898-5.448 0-9.898 4.45-9.898 9.898 0 2.115.596 3.715 1.59 5.392l-1.074 3.923 3.988-1.009zm8.561-5.143c-.473-.237-2.797-1.381-3.23-1.541-.433-.16-.749-.237-1.065.237-.315.474-1.222 1.541-1.498 1.857-.276.316-.552.355-1.025.118-.473-.237-1.996-.736-3.801-2.351-1.401-1.256-2.348-2.808-2.624-3.282-.276-.474-.03-.73.207-.967.214-.213.473-.553.71-.83.237-.277.315-.474.474-.79.158-.316.079-.593-.04-.83-.118-.237-1.065-2.571-1.458-3.522-.382-.927-.773-.801-1.065-.815-.276-.014-.593-.014-.908-.014-.316 0-.829.118-1.263.593-.434.474-1.658 1.62-1.658 3.951 0 2.33 1.7 4.582 1.936 4.898.237.316 3.338 5.093 8.087 7.142 1.131.488 2.013.78 2.702 9.998.749.214 1.433.079 1.968-.159.574-.256 1.848-1.144 2.111-2.25.263-1.106.263-2.053.184-2.25-.079-.197-.315-.316-.788-.553z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
