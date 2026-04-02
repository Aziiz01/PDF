/**
 * Encrypts per-user secrets (e.g. OpenAI API keys) at rest.
 * Key material is derived from JWT_SECRET; rotating JWT_SECRET invalidates stored keys.
 */
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'node:crypto'
import { getJwtSecretKey } from '@/lib/jwt'

const ALGO = 'aes-256-gcm'
const SALT = 'pdf-snap-openai-key-v1'

function deriveKey(): Buffer {
  return scryptSync(getJwtSecretKey(), SALT, 32)
}

export function encryptUserSecret(plain: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGO, deriveKey(), iv)
  const enc = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64')
}

export function decryptUserSecret(enc: string): string {
  const buf = Buffer.from(enc, 'base64')
  if (buf.length < 32) throw new Error('Invalid secret payload')
  const iv = buf.subarray(0, 16)
  const tag = buf.subarray(16, 32)
  const data = buf.subarray(32)
  const decipher = createDecipheriv(ALGO, deriveKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]).toString('utf8')
}
