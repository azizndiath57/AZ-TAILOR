# DOSSIER DE PASSATION : AZ-TAILOR

Ce fichier sert de documentation de référence et de passage de témoin pour le projet AZ-TAILOR. Il résume l'état actuel de l'application, son architecture, et donne des directives pour les futures évolutions.

## 1. Ce que l'application fait
AZ-TAILOR est une application web de gestion complète dédiée aux ateliers de couture sur-mesure. Elle permet aux tailleurs de dématérialiser leur activité : gestion des clients (carnet de mesures), suivi de la production des vêtements (commandes), suivi financier (acomptes, restes à payer), et génération de factures professionnelles avec partage sur WhatsApp.

## 2. Toutes les fonctionnalités implémentées
- **Tableau de bord (Dashboard)** : Vue d'ensemble des statistiques (revenus, commandes en cours), liste des tâches "À faire aujourd'hui" (Flat Design), barre de recherche globale, et système de notifications.
- **Gestion des Commandes** : 
  - Création de commande avec flux optimisé : possibilité de saisir les mesures du client directement depuis le formulaire de commande sans perdre les données.
  - Suivi des statuts de commande (En attente, En cours, Prêt, Livré) et des statuts de paiement (Non payé, Partiel, Payé).
- **Facturation** :
  - Génération automatique de factures optimisées pour l'impression A4 et la lecture sur écran.
  - En-tête dynamique récupérant le nom, logo et contact de l'atelier depuis les paramètres.
  - Bouton de génération d'un message WhatsApp pré-rempli pour relancer le client avec le reste à payer.
- **Clients (Carnet de mesures)** :
  - Liste des clients et moteur de recherche.
  - Fiche client avec historique des commandes et gestion détaillée des mensurations.
- **Paramètres de l'atelier** :
  - Profil : Personnalisation du nom, adresse, téléphone et logo.
  - Sécurité : Gestion du compte avec boîte de dialogue de confirmation pour la suppression de compte.
  - Préférences : Mode sombre identifié comme fonctionnalité "Premium".

## 3. La structure des fichiers
Le projet suit une architecture claire basée sur Next.js (App Router) et une séparation des préoccupations :

```text
c:\Users\Pc\AZ-TAILOR\
├── app/                        # Couche de présentation (Next.js App Router)
│   ├── (app)/                  # Groupe de routes sécurisées
│   │   ├── dashboard/          # Page d'accueil et statistiques
│   │   ├── orders/             # Liste, création et factures des commandes
│   │   ├── clients/            # Carnet de mesures et profils clients
│   │   └── settings/           # Paramètres de l'atelier
│   ├── actions/                # Actions serveur globales (mutations)
│   ├── components/             # Composants UI réutilisables (GlobalSearch, Modales, etc.)
│   ├── layout.tsx & page.tsx   # Point d'entrée de l'application
│   └── globals.css             # Styles globaux (Tailwind + CSS natif)
├── lib/                        # Couche métier et accès aux données
│   ├── data-access/            # Pattern Repository pour l'accès aux données
│   │   ├── mock/               # Base de données en mémoire (pour le prototypage)
│   │   ├── index.ts            # Factory qui expose les repositories (Mock vs Vraie BDD)
│   │   └── types.ts            # Interfaces TypeScript (Order, Client, etc.)
│   ├── domain/                 # Logique métier pure (types de statuts, règles)
│   └── constants/              # Constantes (méthodes de paiement, etc.)
```

## 4. Les technologies utilisées
- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS (approche utilitaire) et CSS standard pour l'impression.
- **Icônes** : Material Symbols Outlined (via Google Fonts)
- **Rendu** : Utilisation intensive de React Server Components (RSC) couplés aux Server Actions pour les mutations.

## 5. Les décisions de design
- **Esthétique "Flat & Clean"** : Le design est minimaliste, moderne, sans ombres superflues (`shadow-sm` maximum), avec des bordures très fines (`border-gray-100` ou `200`) et des fonds légèrement grisés (`bg-gray-50`) pour séparer les éléments.
- **Pattern Repository** : L'accès aux données passe par `lib/data-access/index.ts`. Le but est que l'UI ne sache jamais si elle parle à un tableau en mémoire (`mock`) ou à une vraie base de données (ex: `Supabase`).
- **Expérience Utilisateur (UX)** : Les formulaires longs ont été évités au profit de tiroirs, de boîtes d'alertes élégantes (ex: modale de succès lors de la création de commande), et d'une saisie de données "inline" (mesures dans la page nouvelle commande) pour éviter les changements de page destructifs.

## 6. Instructions pour un futur modèle IA
À l'attention de la prochaine IA qui reprendra ce projet :
1. **Conserver le Design System** : Respecte l'approche "Flat & Clean". N'ajoute pas d'effets 3D, de dégradés lourds ou d'ombres complexes (`box-shadow` prononcés). Utilise la couleur principale `bg-brand` ou `bg-midnight` (noir/sombre) pour les actions primaires.
2. **Architecture des données** : Toutes les opérations de lecture/écriture doivent impérativement passer par `lib/data-access/index.ts`. N'intègre pas d'appels directs à une base de données dans les composants UI.
3. **Server Actions** : Privilégie les Server Actions (fichiers `actions.ts`) pour gérer les formulaires. Utilise `revalidatePath` après chaque mutation pour mettre à jour l'UI sans recharger la page.
4. **Composants d'interface** : Réutilise les composants existants comme `CustomSelect`, `CustomDatePicker` ou `PhoneInput` plutôt que de recréer de nouveaux formulaires HTML bruts.
5. **Base de données future** : Le code est actuellement connecté au dossier `mock/repositories.ts`. La prochaine grande étape consistera à créer un dossier `supabase/repositories.ts` et à modifier le booléen `isMock` dans `index.ts` pour basculer sur un environnement de production.
