import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/db'
import {
  responseIfDbUnavailable,
  responseIfPrismaUserError,
} from '@/lib/db-errors'
import { SESSION_COOKIE, signSessionToken } from '@/lib/jwt'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email or password (min 8 characters).' },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data
  const normalized = email.toLowerCase().trim()

  try {
    const existing = await db.user.findUnique({
      where: { email: normalized },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()

    await db.user.create({
      data: {
        id,
        email: normalized,
        passwordHash,
      },
    })

    const token = await signSessionToken(id, normalized)
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
    const duplicate = responseIfPrismaUserError(err)
    if (duplicate) return duplicate
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Try again later.' },
      { status: 500 }
    )
  }
}
