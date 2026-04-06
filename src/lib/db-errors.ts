import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

const CONNECTION_LIKE_CODES = new Set([
  'P1001', // Can't reach database server
  'P1002', // Connection timed out
  'P1017', // Server closed the connection
  'P2010', // Raw query failed (often Mongo TLS / network)
  'P2024', // Timed out fetching a new connection from pool
])

function messageLooksLikeMongoAuthFailure(err: unknown): boolean {
  const msg =
    err instanceof Error
      ? `${err.message} ${String((err as Error & { cause?: unknown }).cause)}`
      : String(err)
  return /SCRAM|bad auth|AuthenticationFailed|authentication failed/i.test(
    msg
  )
}

/**
 * Maps Prisma / MongoDB failures to a JSON response for API routes.
 */
export function responseIfDbUnavailable(
  err: unknown
): NextResponse | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P1000') {
      return NextResponse.json(
        {
          error:
            'Database authentication failed. In Atlas: Database → Users, reset the DB user password. In .env: put the user and password in DATABASE_URL. If the password contains @ # : % etc., URL-encode it (e.g. @ → %40).',
        },
        { status: 503 }
      )
    }
    if (CONNECTION_LIKE_CODES.has(err.code)) {
      return NextResponse.json(
        {
          error:
            'Cannot reach the database. Check DATABASE_URL, MongoDB Atlas Network Access (IP allowlist), that the cluster is not paused, and try without VPN if you see TLS errors.',
        },
        { status: 503 }
      )
    }
  }
  if (messageLooksLikeMongoAuthFailure(err)) {
    return NextResponse.json(
      {
        error:
          'Database authentication failed. Verify the username and password in DATABASE_URL match Atlas (Database → Users). URL-encode special characters in the password.',
      },
      { status: 503 }
    )
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        error:
          'Database failed to initialize. Verify DATABASE_URL and database availability.',
      },
      { status: 503 }
    )
  }
  return null
}

/**
 * Returns a JSON response for errors that should not surface as generic 500.
 */
export function responseIfPrismaUserError(
  err: unknown
): NextResponse | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const raw = err.meta?.target
      // MongoDB stores the index name (e.g. "email_1"), Postgres stores field
      // names as an array (["email"]). Normalise both to a single string.
      const target = Array.isArray(raw)
        ? raw.join(', ')
        : typeof raw === 'string'
        ? raw
        : ''
      if (target.toLowerCase().includes('email')) {
        return NextResponse.json(
          { error: 'This email is already registered.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'A record with this value already exists.' },
        { status: 409 }
      )
    }
  }
  return null
}
