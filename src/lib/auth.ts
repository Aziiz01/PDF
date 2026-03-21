import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'

type AuthUser = {
  id: string
  email: string
  given_name: string | null
  family_name: string | null
  name: string | null
  picture: string | null
  updated_at: string | null
}

/**
 * Gets the current user for server-side operations.
 * When no Kinde session exists, uses first DB user or creates a fallback user.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { getUser } = getKindeServerSession()
  let user = getUser()

  // Fallback: when no Kinde session, use first DB user or create one (works in dev and production)
  if (!user || !user.id) {
    let dbUser = await db.user.findFirst()
    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          id: 'dev-user',
          email: 'dev@localhost',
        },
      })
    }
    return {
      id: dbUser.id,
      email: dbUser.email,
      given_name: null,
      family_name: null,
      name: null,
      picture: null,
      updated_at: null,
    }
  }

  if (!user?.id) return null
  const given = user.given_name ?? null
  const family = user.family_name ?? null
  const name = given && family ? `${given} ${family}` : given ?? family ?? null
  return {
    id: user.id,
    email: user.email ?? '',
    given_name: given,
    family_name: family,
    name,
    picture: user.picture ?? null,
    updated_at: null,
  }
}

/** Convenience: get user ID only */
export async function getUserId(): Promise<string | null> {
  const user = await getAuthUser()
  return user?.id ?? null
}
