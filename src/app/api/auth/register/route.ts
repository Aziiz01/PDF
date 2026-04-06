import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/db'
import { responseIfDbUnavailable } from '@/lib/db-errors'
import { SESSION_COOKIE, signSessionToken } from '@/lib/jwt'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

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
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data
  const normalized = email.toLowerCase().trim()
  const passwordHash = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()

  try {
    // Attempt to create the user directly.
    // This is the authoritative uniqueness check — the DB constraint
    // is the only reliable source of truth.
    await db.user.create({
      data: { id, email: normalized, passwordHash },
    })

    const token = await signSessionToken(id, normalized)
    const res = NextResponse.json({ ok: true })
    setSessionCookie(res, token)
    return res
  } catch (err) {
    const unavailable = responseIfDbUnavailable(err)
    if (unavailable) return unavailable

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      // A document with this email already exists.
      // If it has no password (e.g. leftover from a previous auth provider)
      // let the user set one now. Otherwise they must sign in.
      const existing = await db.user.findUnique({
        where: { email: normalized },
        select: { id: true, passwordHash: true },
      })

      if (!existing) {
        // Extremely unlikely race — just retry would work, surface as 500.
        return NextResponse.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500 }
        )
      }

      if (existing.passwordHash) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 409 }
        )
      }

      // Account exists but has no password — set one now.
      await db.user.update({
        where: { id: existing.id },
        data: { passwordHash },
      })

      const token = await signSessionToken(existing.id, normalized)
      const res = NextResponse.json({ ok: true })
      setSessionCookie(res, token)
      return res
    }

    console.error('[POST /api/auth/register]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Try again later.' },
      { status: 500 }
    )
  }
}
