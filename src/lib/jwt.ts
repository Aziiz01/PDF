import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'pdfsnap_session'

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'JWT_SECRET must be set to a string of at least 16 characters in production'
      )
    }
    return new TextEncoder().encode(
      'dev-showcase-secret-min-16-chars'
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signSessionToken(
  userId: string,
  email: string
) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey())
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())
    const sub = payload.sub
    const email = payload.email
    if (typeof sub !== 'string' || typeof email !== 'string')
      return null
    return { userId: sub, email }
  } catch {
    return null
  }
}
