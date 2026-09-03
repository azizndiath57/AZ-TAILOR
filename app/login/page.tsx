import { login, signup, signInWithGoogle } from "./actions";
import Link from "next/link";
import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; mode?: string; success?: string }>;
}) {
  const { error, mode = "login", success } = await searchParams;
  const isLogin = mode !== "signup";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
            Votre atelier de couture, dans le cloud.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <Link
            href="?mode=login"
            className={`flex-1 text-center py-4 text-sm font-medium transition-colors ${isLogin ? "text-brand border-b-2 border-brand bg-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            Connexion
          </Link>
          <Link
            href="?mode=signup"
            className={`flex-1 text-center py-4 text-sm font-medium transition-colors ${!isLogin ? "text-brand border-b-2 border-brand bg-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            Créer un compte
          </Link>
        </div>

        <form className="p-8" action={isLogin ? login : signup}>
          <div className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    htmlFor="firstName"
                  >
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    htmlFor="lastName"
                  >
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="email"
              >
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="tailleur@exemple.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Mot de passe
                </label>
                {isLogin && (
                  <Link
                    href="#"
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="confirmPassword"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0">
                  error
                </span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0">
                  check_circle
                </span>
                <span>{success}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                {isLogin ? "Se connecter" : "Créer mon compte"}
              </button>
            </div>
          </div>
        </form>

        {/* Google Auth */}
        <div className="px-8 pb-8">
          <div className="relative mt-2 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>
          
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? (
              <>
                Pas encore de compte ?{" "}
                <Link
                  href="?mode=signup"
                  className="text-brand font-medium hover:underline"
                >
                  Inscrivez-vous
                </Link>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{" "}
                <Link
                  href="?mode=login"
                  className="text-brand font-medium hover:underline"
                >
                  Connectez-vous
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
