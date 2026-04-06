import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/db'
import { responseIfDbUnavailable } from '@/lib/db-errors'
import { SESSION_COOKIE, signSessionToken } from '@/lib/jwt'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data
  const normalized = email.toLowerCase().trim()

  try {
    const user = await db.user.findUnique({ where: { email: normalized } })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const token = await signSessionToken(user.id, user.email)
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    const unavailable = responseIfDbUnavailable(err)
    if (unavailable) return unavailable
    console.error('[POST /api/auth/login]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Try again later.' },
      { status: 500 }
    )
  }
}
