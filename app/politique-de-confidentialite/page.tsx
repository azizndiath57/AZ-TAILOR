import React from "react";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité | AZ-TAILORS",
  description: "Politique de confidentialité et protection des données personnelles sur AZ-TAILORS.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <Navbar />
      
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
        <article className="space-y-8">
          <header className="mb-12">
            <p className="font-label-sm text-secondary uppercase tracking-widest mb-4">Légal</p>
            <h1 className="font-display text-4xl md:text-5xl text-primary leading-tight font-bold">
              Politique de Confidentialité
            </h1>
            <p className="text-sm text-on-surface-variant mt-4">Dernière mise à jour : 02/09/2026</p>
          </header>

          <div className="prose prose-lg text-on-surface-variant space-y-8">
            
            <section>
              <h2 className="font-display text-2xl text-primary mb-4">1. Qui sommes-nous</h2>
              <p>
                AZ-TAILORS est un service édité par ABDOUL AZIZ NDIAYE, qui a comme statut juridique, entrepreneur individuel, et qui est basé à Guédiawaye dans la ville de Dakar.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">2. Les données que nous collectons</h2>
              
              <h3 className="font-bold text-lg mt-6 mb-2">Votre compte (données de l'atelier)</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>ABDOUL AZIZ NDIAYE</li>
                <li>azizndiath57@gmail.com</li>
                <li>+221778685084</li>
                <li>AZ-TAILOR</li>
                <li>Mot de passe (chiffré)</li>
              </ul>

              <h3 className="font-bold text-lg mt-6 mb-2">Les données que vous saisissez sur vos clientes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Nom, prénom, téléphone, adresse</li>
                <li>Mesures corporelles</li>
                <li>Notes et préférences</li>
                <li>Photos de tissus et de modèles</li>
              </ul>

              <h3 className="font-bold text-lg mt-6 mb-2">Les données de vos commandes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Référence, type de tenue, délais, dates</li>
                <li>Prix, acomptes, paiements, moyen de paiement</li>
              </ul>

              <h3 className="font-bold text-lg mt-6 mb-2">Données techniques</h3>
              <p>
                Journaux de connexion et adresse IP, pour la sécurité du service.
              </p>
              <p className="italic mt-4">
                Nous ne collectons aucune donnée à des fins publicitaires et nous n'utilisons pas de traceurs marketing.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">3. Un point important sur les données de vos clientes</h2>
              <p>
                Les informations que vous enregistrez sur vos clientes vous appartiennent. Vous en êtes responsable : c'est à vous d'informer vos clientes que leurs mesures et coordonnées sont enregistrées dans un outil de gestion, et d'obtenir leur accord.
              </p>
              <p className="mt-4">
                AZ-TAILORS agit uniquement comme prestataire technique. Nous stockons ces données pour vous, nous ne les exploitons pas, nous ne les revendons pas, et nous n'y accédons pas en dehors des cas prévus au point 6.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">4. Pourquoi nous traitons ces données</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Faire fonctionner le service que vous avez souscrit.</li>
                <li>Vous permettre de gérer vos clientes, commandes et paiements.</li>
                <li>Envoyer les notifications automatiques à vos clientes quand une commande est prête.</li>
                <li>Gérer votre abonnement et sa facturation.</li>
                <li>Assurer la sécurité du service et prévenir les fraudes.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">5. Où sont hébergées vos données</h2>
              <p>
                Les données sont hébergées chez Supabase, sur des serveurs situés en Europe (Francfort). Les connexions sont chiffrées (HTTPS), et l'accès aux données de votre atelier est restreint à votre compte par des règles de sécurité strictes au niveau de la base de données.
              </p>
              <p className="mt-4">
                Les messages automatiques envoyés à vos clientes transitent par WhatsApp via l'appareil de l'utilisateur.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">6. Qui peut accéder à vos données</h2>
              <p>
                Personne d'autre que vous et les utilisateurs que vous invitez dans votre atelier.
              </p>
              <p className="mt-4">
                Notre équipe technique ne consulte vos données que dans deux cas : si vous nous le demandez pour résoudre un problème, ou si la loi nous y oblige.
              </p>
              <p className="mt-4 font-medium">
                Nous ne vendons ni ne louons vos données à qui que ce soit.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">7. Combien de temps nous les gardons</h2>
              <p>
                Vos données sont conservées tant que votre compte est actif. Après la suppression de votre compte, elles sont effacées définitivement sous 30 jours.
              </p>
              <p className="mt-4">
                Les documents comptables liés à votre abonnement sont conservés plus longtemps si la loi l'exige.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">8. Vos droits</h2>
              <p>Vous pouvez à tout moment :</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>accéder à vos données et en demander une copie</li>
                <li>corriger une information inexacte</li>
                <li>supprimer votre compte et l'ensemble de vos données</li>
                <li>vous opposer à un traitement</li>
              </ul>
              <p>
                Écrivez à <strong>azizndiath57@gmail.com</strong>. Nous répondons sous 30 jours.
              </p>
              <p className="mt-4">
                Conformément à la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel, vous pouvez également saisir la Commission de Protection des Données Personnelles (CDP) du Sénégal.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">9. Cookies</h2>
              <p>
                Nous utilisons uniquement les cookies nécessaires au fonctionnement du service : ceux qui vous maintiennent connecté à votre compte. Aucun cookie publicitaire, aucun traceur tiers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-4">10. Modifications</h2>
              <p>
                Nous pouvons faire évoluer cette politique. En cas de changement important, vous serez prévenu par email ou dans l'application.
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
