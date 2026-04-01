import { cookies } from 'next/headers'
import { db } from '@/db'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/jwt'

export type AuthUser = {
  id: string
  email: string
  given_name: string | null
  family_name: string | null
  name: string | null
  picture: string | null
  updated_at: string | null
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const session = await verifySessionToken(token)
    if (!session) return null

    const user = await db.user.findUnique({
      where: { id: session.userId },
    })
    if (!user) return null

    const displayName =
      user.email.split('@')[0] ?? user.email

    return {
      id: user.id,
      email: user.email,
      given_name: null,
      family_name: null,
      name: displayName,
      picture: null,
      updated_at: null,
    }
  } catch (err) {
    const digest =
      typeof err === 'object' &&
      err !== null &&
      'digest' in err &&
      (err as { digest?: string }).digest ===
        'DYNAMIC_SERVER_USAGE'
    const message =
      err instanceof Error ? err.message : ''
    if (
      digest ||
      message.includes('Dynamic server usage')
    ) {
      return null
    }
    console.error('[getAuthUser]', err)
    return null
  }
}

export async function getUserId(): Promise<string | null> {
  const user = await getAuthUser()
  return user?.id ?? null
}
