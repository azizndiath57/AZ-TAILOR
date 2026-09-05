"use client";

import { login } from "./actions";
import Link from "next/link";
import { useActionState } from "react";

export default function ConnexionPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paytech-theme p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-4 text-center bg-midnight/5 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 text-brand mb-4">
            <span className="material-symbols-outlined text-2xl">cut</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            AZ-TAILOR
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Connexion à votre espace
          </p>
        </div>

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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-medium">+221</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Mot de passe
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="text"
                required
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
                {isPending ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </div>
        </form>

        <div className="px-8 pb-8">
          <div className="text-center text-sm text-gray-500 mt-2">
            Pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="text-brand font-medium hover:underline"
            >
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
