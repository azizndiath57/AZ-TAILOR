"use client";

import { resetPassword } from "./actions";
import Link from "next/link";
import { useActionState } from "react";
import { useState } from "react";

export default function MotDePasseOubliePage() {
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const [success, setSuccess] = useState(false);

  // Intercept the action to show success state if no error
  const handleAction = async (formData: FormData) => {
    // We can't easily intercept useActionState success without it returning a value
    // So we'll just check if there's no error after a small delay, but it's better
    // to let the action return a success flag or redirect.
    // The action will return { success: true } if it works.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paytech-theme p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-4 text-center bg-midnight/5 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 text-brand mb-4">
            <span className="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Réinitialisez votre mot de passe
          </p>
        </div>

        {state?.success ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Mot de passe modifié !</h2>
            <p className="text-gray-500 mb-8">Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.</p>
            <Link
              href="/connexion"
              className="w-full flex items-center justify-center px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors shadow-sm"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="p-8" action={formAction}>
            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="phone"
                >
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="recoveryCode"
                >
                  Code de récupération (6 chiffres)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">key</span>
                  </div>
                  <input
                    id="recoveryCode"
                    name="recoveryCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    autoComplete="off"
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all tracking-widest"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Ce code est disponible dans les paramètres de votre compte.</p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="password"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="text"
                  required
                  minLength={6}
                  maxLength={10}
                  autoComplete="new-password"
                  style={{ WebkitTextSecurity: "disc" } as any}
                  className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                />
              </div>

              {state?.error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                  <span className="material-symbols-outlined text-base shrink-0">
                    error
                  </span>
                  <span>{state.error}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isPending ? "Modification en cours..." : "Modifier le mot de passe"}
                </button>
              </div>
            </div>
          </form>
        )}

        {!state?.success && (
          <div className="px-8 pb-8">
            <div className="text-center text-sm text-gray-500 mt-2">
              <Link
                href="/connexion"
                className="text-brand font-medium hover:underline flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
