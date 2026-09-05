"use client";

import React, { useEffect, useState } from "react";
import { getAdminDashboardData } from "@/app/actions/admin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{users: any[], totalUsers: number, activeSubscriptions: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de bord global</h2>
        <p className="text-gray-500 mt-1">Vue d'ensemble de l'activité sur AZ-TAILOR</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-blue-600 text-2xl">group</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Utilisateurs</h3>
            <p className="text-3xl font-bold text-gray-900">{data.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-green-600 text-2xl">verified</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Abonnements Actifs (Pro)</h3>
            <p className="text-3xl font-bold text-gray-900">{data.activeSubscriptions}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-orange-600 text-2xl">hourglass_empty</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">En Période d'Essai</h3>
            <p className="text-3xl font-bold text-gray-900">
              {data.users.filter(u => u.subscription?.plan === 'free' && !u.subscription?.isTrialExpired).length}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Liste des Tailleurs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Atelier</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Téléphone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Abonnement</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {user.nom_atelier?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.nom_atelier || 'Atelier non nommé'}</div>
                        {user.role === 'admin' && <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase">Admin</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4">
                    {user.subscription?.plan === 'pro' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        PRO Actif
                      </span>
                    ) : user.subscription?.isTrialExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Essai Expiré
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        Essai (reste {user.subscription?.trialDaysLeft} j)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                  </td>
                </tr>
              ))}
              
              {data.users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
