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
 * In development with no Kinde session, uses or creates a dev user.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { getUser } = getKindeServerSession()
  let user = getUser()

  // Auth bypass: in development, use first DB user or create dev user when no Kinde session
  if ((!user || !user.id) && process.env.NODE_ENV === 'development') {
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
  return {
    id: user.id,
    email: user.email ?? '',
    given_name: user.given_name ?? null,
    family_name: user.family_name ?? null,
    name: user.name ?? null,
    picture: user.picture ?? null,
    updated_at: user.updated_at ?? null,
  }
}

/** Convenience: get user ID only */
export async function getUserId(): Promise<string | null> {
  const user = await getAuthUser()
  return user?.id ?? null
}
