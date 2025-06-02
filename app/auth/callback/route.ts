import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    
    console.log('Auth callback API: Processing callback with code:', !!code)

    if (code) {
      const supabase = createRouteHandlerClient({ 
        cookies,
        // Important: Don't specify cookieOptions here for auth callbacks
      })
      
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('Auth callback API: Exchange failed:', error.message)
          // Redirect to error page with error info
          return NextResponse.redirect(`${origin}/auth/callback?error=${encodeURIComponent(error.message)}`)
        }
        
        console.log('Auth callback API: Exchange successful for user:', data.user?.email)
        
        // Success - redirect to the frontend callback page
        return NextResponse.redirect(`${origin}/auth/callback?success=true`)
        
      } catch (exchangeError) {
        console.error('Auth callback API: Exchange exception:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/callback?error=${encodeURIComponent('Authentication failed')}`)
      }
    }

    // No code present - this might be a direct access or error
    console.log('Auth callback API: No code parameter found')
    
    // Check for error parameters and pass them through
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')
    
    if (error) {
      const redirectUrl = new URL('/auth/callback', origin)
      redirectUrl.searchParams.set('error', error)
      if (errorDescription) {
        redirectUrl.searchParams.set('error_description', errorDescription)
      }
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    // Fallback - redirect to login if no code and no error
    return NextResponse.redirect(`${origin}/login`)
    
  } catch (error) {
    console.error('Auth callback API: Unexpected error:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/callback?error=${encodeURIComponent('Server error')}`)
  }
}

// Handle POST requests (some OAuth providers might use POST)
export async function POST(request: NextRequest) {
  return GET(request)
}
