import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/jwt'

export const config = {
  matcher: ['/dashboard/:path*'],
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    const signIn = new URL('/sign-in', request.url)
    signIn.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(signIn)
  }

  const session = await verifySessionToken(token)
  if (!session) {
    const res = NextResponse.redirect(
      new URL('/sign-in', request.url)
    )
    res.cookies.delete(SESSION_COOKIE)
    return res
  }

  return NextResponse.next()
}
