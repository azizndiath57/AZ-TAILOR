"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ThemeChoice, THEME_STORAGE_KEY } from "@/lib/theme";

const CHANGE_EVENT = "az-theme-change";

function readChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "dark" || v === "system") return v;
  } catch {}
  return "light";
}

// Les deux boutons (barre mobile et menu ordinateur) restent synchronisés
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function applyTheme(choice: ThemeChoice) {
  const dark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

const NEXT: Record<ThemeChoice, ThemeChoice> = { light: "dark", dark: "system", system: "light" };
const ICON: Record<ThemeChoice, string> = { light: "light_mode", dark: "dark_mode", system: "brightness_auto" };
const LABEL: Record<ThemeChoice, string> = {
  light: "Mode clair",
  dark: "Mode sombre",
  system: "Automatique (réglage du téléphone)",
};

/** Bouton qui fait défiler : clair → sombre → automatique. */
export default function ThemeToggle() {
  // null côté serveur : le choix n'est connu que dans le navigateur, on n'affiche pas d'icône d'ici là
  const stored = useSyncExternalStore(subscribe, readChoice, () => null);
  const choice: ThemeChoice = stored ?? "light";

  // En mode automatique, suivre le changement de réglage du téléphone
  useEffect(() => {
    if (choice !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice]);

  const cycle = () => {
    const next = NEXT[choice];
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={cycle}
      title={`${LABEL[choice]} (cliquer pour changer)`}
      aria-label={`Thème : ${LABEL[choice]}. Cliquer pour changer`}
      className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[20px] w-5">{stored ? ICON[stored] : ""}</span>
    </button>
  );
}
