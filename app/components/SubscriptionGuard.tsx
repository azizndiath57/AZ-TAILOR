'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SubscriptionStatus } from '@/app/actions/subscription';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  status: SubscriptionStatus;
}

export default function SubscriptionGuard({ children, status }: SubscriptionGuardProps) {
  const pathname = usePathname();

  // If trial is expired and the user is NOT on the settings page, block access.
  if (status.isTrialExpired && pathname !== '/settings') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
          <span className="material-symbols-outlined text-4xl text-red-500">lock</span>
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-900">Période d'essai terminée</h2>
        <p className="text-gray-600 mb-8 max-w-lg text-lg">
          Votre période d'essai gratuit de 30 jours est arrivée à son terme. Pour continuer à gérer vos clients et vos commandes, veuillez activer un abonnement.
        </p>
        <Link 
          href="/settings" 
          className="px-8 py-3.5 bg-brand text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-brand/90 hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">credit_card</span>
          Voir les abonnements
        </Link>
      </div>
    );
  }

  return (
    <>
      {!status.isTrialExpired && status.plan === 'free' && status.trialDaysLeft <= 5 && (
        <div className="bg-orange-50 border-b border-orange-100 px-4 py-2 text-center text-sm text-orange-800 font-medium hidden md:block">
          Il vous reste {status.trialDaysLeft} {status.trialDaysLeft > 1 ? 'jours' : 'jour'} d'essai gratuit. Pensez à activer votre abonnement pour ne pas être bloqué.
        </div>
      )}
      {children}
    </>
  );
}
