// Thème clair / sombre de l'espace connecté (voir app/globals.css et ThemeToggle)

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "az-theme";

// Exécuté dans <head> avant l'affichage, pour éviter un flash blanc au chargement
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
