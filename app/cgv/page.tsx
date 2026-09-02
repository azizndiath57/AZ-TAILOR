import React from "react";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import Link from "next/link";

export const metadata = {
  title: "Conditions Générales de Vente | AZ-TAILORS",
  description: "Conditions générales d'utilisation et de vente du service AZ-TAILORS.",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <Navbar />
      
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
        <article className="space-y-8">
          <header className="mb-12">
            <p className="font-label-sm text-secondary uppercase tracking-widest mb-4">Légal</p>
            <h1 className="font-display text-4xl md:text-5xl text-primary leading-tight font-bold">
              Conditions Générales de Vente
            </h1>
            <p className="text-sm text-on-surface-variant mt-4">Dernière mise à jour : 02/09/2026</p>
          </header>

          <div className="prose prose-lg text-on-surface-variant space-y-8">
            
            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 1 — Objet</h2>
              <p>
                Les présentes conditions régissent l'utilisation du service AZ-TAILORS, une application en ligne de gestion d'atelier de couture, éditée par AZ-TAILOR, entreprise individuel, Guédiawaye, Dakar.
              </p>
              <p className="mt-4">
                Créer un compte vaut acceptation de ces conditions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 2 — Le service</h2>
              <p>
                AZ-TAILORS permet notamment de gérer un fichier clientes et leurs mesures, d'enregistrer et suivre des commandes, de suivre les acomptes et les paiements, de générer des fiches de commande imprimables et d'envoyer des notifications automatiques aux clientes.
              </p>
              <p className="mt-4">
                Le service est accessible en ligne, sans installation, depuis un navigateur.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 3 — Compte</h2>
              <p>
                Vous devez fournir des informations exactes à l'inscription. Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité effectuée depuis votre compte. Prévenez-nous immédiatement en cas d'utilisation non autorisée.
              </p>
              <p className="mt-4">
                Le service est réservé aux personnes majeures et aux professionnels.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 4 — Formules et tarifs</h2>
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-outline-variant/30 text-left text-sm">
                  <thead className="bg-surface-container">
                    <tr>
                      <th className="border border-outline-variant/30 px-4 py-3 font-semibold text-primary">Formule</th>
                      <th className="border border-outline-variant/30 px-4 py-3 font-semibold text-primary">Prix</th>
                      <th className="border border-outline-variant/30 px-4 py-3 font-semibold text-primary">Contenu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-outline-variant/30 px-4 py-3 font-medium">Gratuit</td>
                      <td className="border border-outline-variant/30 px-4 py-3">0 FCFA</td>
                      <td className="border border-outline-variant/30 px-4 py-3">10 commandes par mois, 1 utilisateur</td>
                    </tr>
                    <tr>
                      <td className="border border-outline-variant/30 px-4 py-3 font-medium">Pro</td>
                      <td className="border border-outline-variant/30 px-4 py-3">5 000 FCFA / mois</td>
                      <td className="border border-outline-variant/30 px-4 py-3">Commandes illimitées, 1 utilisateur</td>
                    </tr>
                    <tr>
                      <td className="border border-outline-variant/30 px-4 py-3 font-medium">Atelier</td>
                      <td className="border border-outline-variant/30 px-4 py-3">15 000 FCFA / mois</td>
                      <td className="border border-outline-variant/30 px-4 py-3">Commandes illimitées, plusieurs utilisateurs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Les prix sont indiqués en francs CFA, toutes taxes comprises.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 5 — Paiement</h2>
              <p>
                L'abonnement est payable d'avance, par mois, via Wave, Orange Money ou virement bancaire.
              </p>
              <p className="mt-4">
                En cas de non-paiement, l'accès aux fonctions payantes est suspendu après 7 jours. Vos données restent conservées et redeviennent accessibles dès la régularisation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 6 — Durée et résiliation</h2>
              <p>
                L'abonnement est mensuel, reconduit automatiquement à chaque échéance.
              </p>
              <p className="mt-4">
                Vous pouvez résilier à tout moment depuis votre compte ou en écrivant à <strong>azizndiath57@gmail.com</strong>. La résiliation prend effet à la fin du mois en cours. Les sommes déjà versées pour le mois entamé ne sont pas remboursées.
              </p>
              <p className="mt-4">
                Nous pouvons suspendre ou fermer un compte en cas de manquement grave aux présentes conditions, après vous en avoir informé.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 7 — Rétractation</h2>
              <p>
                Le service étant fourni immédiatement après souscription et destiné à un usage professionnel, il ne donne pas lieu à un droit de rétractation. La formule gratuite vous permet de tester l'outil avant tout paiement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 8 — Disponibilité</h2>
              <p>
                Nous mettons tout en œuvre pour assurer un service continu, sans garantir une disponibilité ininterrompue. Le service peut être suspendu pour maintenance, mise à jour, ou en cas de panne d'un prestataire technique.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 9 — Vos données et vos contenus</h2>
              <p>
                Les données que vous saisissez restent votre propriété. Vous pouvez les exporter à tout moment et demander leur suppression.
              </p>
              <p className="mt-4">
                Vous garantissez avoir le droit d'enregistrer les données de vos clientes et de les informer de cet enregistrement, conformément à notre politique de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 10 — Responsabilité</h2>
              <p>
                AZ-TAILORS est un outil de gestion. Vous restez seul responsable de votre activité, de vos engagements envers vos clientes, de l'exactitude des mesures et des montants que vous saisissez, et du respect de vos obligations légales et fiscales.
              </p>
              <p className="mt-4">
                Notre responsabilité ne peut être engagée au-delà des sommes que vous avez versées au titre des 3 derniers mois d'abonnement.
              </p>
              <p className="mt-4 font-medium">
                Il vous appartient d'exporter régulièrement vos données importantes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 11 — Propriété intellectuelle</h2>
              <p>
                Le code, le design, la marque et les contenus d'AZ-TAILORS restent notre propriété. Votre abonnement vous donne un droit d'usage personnel et non exclusif du service, sans transfert de propriété.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 12 — Modification des conditions</h2>
              <p>
                Nous pouvons modifier ces conditions et nos tarifs. Vous serez prévenu au moins 30 jours à l'avance. À défaut d'acceptation, vous pourrez résilier sans frais.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 13 — Droit applicable</h2>
              <p>
                Les présentes conditions sont soumises au droit sénégalais. En cas de litige, les parties chercheront une solution amiable avant toute action judiciaire. À défaut, compétence est attribuée aux tribunaux de Dakar.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Article 14 — Contact</h2>
              <p>
                Pour toute question, contactez-nous à l'adresse suivante : <strong>azizndiath57@gmail.com</strong>
              </p>
            </section>

          </div>

          <div className="pt-12 mt-12 border-t border-outline-variant/20 flex flex-col items-center gap-6">
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
