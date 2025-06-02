import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // If user is accessing the main app but has a recent recovery session, redirect to password reset
  if (session?.user && req.nextUrl.pathname === '/') {
    const lastSignIn = new Date(session.user.last_sign_in_at || 0).getTime()
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    
    // Check if this might be a recovery session that bypassed password reset
    if (lastSignIn > fiveMinutesAgo) {
      const searchParams = req.nextUrl.searchParams
      const fromRecovery = searchParams.get('from') === 'recovery'
      
      // If recent sign-in and no password_changed flag, check if it might be recovery
      if (!searchParams.get('password_changed') && !searchParams.get('verified')) {
        // Additional check for recovery indicators
        const userAgent = req.headers.get('user-agent') || ''
        const referer = req.headers.get('referer') || ''
        
        // If coming from email or very recent session, be safe and redirect to reset
        if (referer.includes('supabase.co') || userAgent.includes('Mail')) {
          return NextResponse.redirect(new URL('/auth/reset-password?from=recovery&security=check', req.url))
        }
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/).*)',
  ],
}
