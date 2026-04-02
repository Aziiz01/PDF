import { db } from '@/db'
import { decryptUserSecret } from '@/lib/encrypt-secret'

export async function getUserOpenAiApiKey(
  userId: string
): Promise<string | null> {
  const user = await db.user.findFirst({
    where: { id: userId },
    select: { openaiApiKeyEnc: true },
  })
  if (!user?.openaiApiKeyEnc) return null
  try {
    return decryptUserSecret(user.openaiApiKeyEnc)
  } catch {
    console.error('[openai-user] Failed to decrypt stored key')
    return null
  }
}
