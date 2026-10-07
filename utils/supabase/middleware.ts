import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-site tracking.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes condition
  // Any route inside `(app)` should be protected
  // However, Next.js routes are evaluated by their URL path.
  // The (app) group routes mapped to:
  // /, /dashboard, /orders, /clients, /settings
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/connexion') && 
                           !request.nextUrl.pathname.startsWith('/inscription') &&
                           !request.nextUrl.pathname.startsWith('/mot-de-passe-oublie') &&
                           !request.nextUrl.pathname.startsWith('/auth') &&
                           !request.nextUrl.pathname.startsWith('/_next') &&
                           !request.nextUrl.pathname.startsWith('/api') &&
                           request.nextUrl.pathname !== '/favicon.ico' &&
                           request.nextUrl.pathname !== '/manifest.webmanifest' &&
                           request.nextUrl.pathname !== '/sw.js' &&
                           !request.nextUrl.pathname.startsWith('/icon') &&
                           !request.nextUrl.pathname.startsWith('/apple-icon') &&
                           request.nextUrl.pathname !== '/' &&
                           request.nextUrl.pathname !== '/a-propos' &&
                           request.nextUrl.pathname !== '/politique-de-confidentialite' &&
                           request.nextUrl.pathname !== '/cgv'

  if (isProtectedRoute && !user) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    return NextResponse.redirect(url)
  }
  
  if ((request.nextUrl.pathname.startsWith('/connexion') || 
       request.nextUrl.pathname.startsWith('/inscription') ||
       request.nextUrl.pathname.startsWith('/mot-de-passe-oublie')) && user) {
     // user is logged in, don't let them see the login page
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
