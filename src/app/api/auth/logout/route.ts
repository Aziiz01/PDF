import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/jwt'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const res = NextResponse.redirect(new URL('/', url.origin))
  res.cookies.delete(SESSION_COOKIE)
  return res
}
