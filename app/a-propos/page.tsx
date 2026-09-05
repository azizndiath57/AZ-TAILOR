import React from "react";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import MagneticButton from "@/app/components/landing/MagneticButton";
import Link from "next/link";

export const metadata = {
  title: "À propos | AZ-TAILORS",
  description: "Découvrez comment AZ-TAILORS a été pensé et créé pour les tailleurs et couturières d'Afrique de l'Ouest.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <Navbar />
      
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
        <article className="space-y-8">
          <header className="mb-12">
            <p className="font-label-sm text-secondary uppercase tracking-widest mb-4">À Propos</p>
            <h1 className="font-display text-4xl md:text-5xl text-primary leading-tight font-bold">
              Né dans les ateliers, pas dans les bureaux
            </h1>
          </header>

          <div className="prose prose-lg text-on-surface-variant space-y-6">
            <p className="font-body-lg font-medium text-primary">
              AZ-TAILORS est un outil de gestion pensé pour les tailleurs et les couturières d'Afrique de l'Ouest.
            </p>

            <p>
              L'idée est partie d'un constat simple : dans la plupart des ateliers, les mesures sont notées dans un cahier. Le cahier se perd, ou l'encre bave, ou la page se déchire. Alors on reprend les mesures de la cliente. Encore. Pendant ce temps, personne ne sait vraiment quelles commandes doivent sortir cette semaine, ni qui a versé son acompte et qui doit encore le solde.
            </p>

            <p className="font-bold text-primary text-xl mt-8">
              Ce n'est pas un problème de sérieux. C'est un problème d'outil.
            </p>

            <p>
              J'ai passé quelques semaines à traîner dans des ateliers de couture à Dakar, à regarder comment le travail s'organise vraiment. Partout la même chose : un savoir-faire impressionnant sur la machine, et à côté, un cahier corné où se perdaient les mesures, les acomptes et les échéances. Ce n'est jamais un manque de sérieux, c'est un manque d'outil — personne n'avait pensé à construire quelque chose pour eux. J'ai décidé de m'y mettre, et AZ-TAILORS est le résultat.
            </p>

            <h2 className="font-display text-3xl text-primary mt-12 mb-6">
              Ce qu'on a voulu faire
            </h2>

            <p>
              Un outil qui marche sur un téléphone, parce que c'est ce que les tailleurs ont dans la poche. Qui parle en FCFA. Qui accepte Wave et Orange Money, pas seulement la carte bancaire. Et qui reste utilisable même quand la connexion est mauvaise.
            </p>

            <p>
              Chaque cliente n'est mesurée qu'une seule fois. Chaque commande garde la photo de son tissu. Chaque échéance est visible avant qu'il ne soit trop tard. Et quand une tenue est prête, la cliente est prévenue automatiquement.
            </p>

            <h2 className="font-display text-3xl text-primary mt-12 mb-6">
              Où on en est
            </h2>

            <p>
              AZ-TAILORS est en version bêta disponible depuis 02/09/2026. L'outil est développé depuis Dakar, et il évolue en écoutant les ateliers qui l'utilisent.
            </p>

            <p>
              Si tu es tailleur ou couturière et qu'il te manque une fonction, dis-le nous. C'est comme ça que le produit se construit.
            </p>
          </div>

          <div className="pt-12 mt-12 border-t border-outline-variant/20 flex flex-col items-center gap-6">
            <MagneticButton
              href="/connexion"
              className="bg-secondary text-on-secondary font-label-md text-label-md px-8 py-4 rounded-full hover:bg-on-secondary-container transition-colors shadow-md"
            >
              Commencer gratuitement
            </MagneticButton>
            <Link
              href="/"
              className="text-primary hover:text-secondary underline underline-offset-4 font-label-md transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
