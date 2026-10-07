"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

// Shown when a free-plan workshop tries to go past its 20 clients
export default function LimitReachedModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("ClientForm");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand/10 mb-4">
          <span className="material-symbols-outlined text-brand text-2xl">workspace_premium</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("limitTitle")}</h3>
        <p className="text-gray-500 mb-6 text-sm">
          {t("limitDesc")}
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            {t("cancel")}
          </button>
          <Link href="/settings?tab=abonnement" className="flex-1 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors">
            {t("upgradeToPro")}
          </Link>
        </div>
      </div>
    </div>
  );
}
