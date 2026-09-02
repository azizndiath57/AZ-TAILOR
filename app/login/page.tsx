import { login, signup, signInWithGoogle } from './actions'
import Link from 'next/link'
import Image from 'next/image'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, mode?: string, success?: string }>
}) {
  const { error, mode = 'login', success } = await searchParams;
  const isLogin = mode !== 'signup';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-4 text-center bg-midnight/5 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 text-brand mb-4">
            <span className="material-symbols-outlined text-2xl">cut</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">AZ-TAILOR</h1>
          <p className="text-sm text-gray-500 mt-2">Votre atelier de couture, dans le cloud.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <Link 
            href="?mode=login" 
            className={`flex-1 text-center py-4 text-sm font-medium transition-colors ${isLogin ? 'text-brand border-b-2 border-brand bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Connexion
          </Link>
          <Link 
            href="?mode=signup" 
            className={`flex-1 text-center py-4 text-sm font-medium transition-colors ${!isLogin ? 'text-brand border-b-2 border-brand bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Créer un compte
          </Link>
        </div>

        <form className="p-8" action={isLogin ? login : signup}>
          <div className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="firstName">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lastName">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="tailleur@exemple.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Mot de passe
                </label>
                {isLogin && (
                  <Link href="#" className="text-xs font-medium text-brand hover:underline">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirmPassword">
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
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                <span>{success}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                {isLogin ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </div>
          </div>
        </form>

        {/* Separator */}
        <div className="px-8 pb-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>
        </div>

        {/* Google Auth */}
        <div className="px-8 pb-8">
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.918H37.44C36.9016 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9525 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7253 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C9.99973 25.6197 9.99973 22.3922 11.0051 19.4113V13.2294H3.03296C-0.371021 20.0112 -0.371021 28.0006 3.03296 34.7825L11.0051 28.6006Z" fill="#FBBC05"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2294L11.0051 19.4113C12.901 13.7232 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? (
              <>
                Pas encore de compte ?{' '}
                <Link href="?mode=signup" className="text-brand font-medium hover:underline">
                  Inscrivez-vous
                </Link>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{' '}
                <Link href="?mode=login" className="text-brand font-medium hover:underline">
                  Connectez-vous
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
