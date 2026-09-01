'use client';

import { signout } from "@/app/login/actions";

export default function LogoutButton() {
  return (
    <form action={signout} className="mt-2 w-full">
      <button 
        type="submit" 
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
          logout
        </span>
        Se déconnecter
      </button>
    </form>
  );
}
