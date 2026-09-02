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
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
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
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login') && 
                           !request.nextUrl.pathname.startsWith('/auth') &&
                           !request.nextUrl.pathname.startsWith('/_next') &&
                           !request.nextUrl.pathname.startsWith('/api') &&
                           request.nextUrl.pathname !== '/favicon.ico' &&
                           request.nextUrl.pathname !== '/' &&
                           request.nextUrl.pathname !== '/a-propos' &&
                           request.nextUrl.pathname !== '/politique-de-confidentialite' &&
                           request.nextUrl.pathname !== '/cgv'

  if (isProtectedRoute && !user) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  if (request.nextUrl.pathname.startsWith('/login') && user) {
     // user is logged in, don't let them see the login page
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
