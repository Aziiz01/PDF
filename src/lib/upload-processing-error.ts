import {
  pineconeDimensionSetupHint,
  pineconeEnvironmentSetupHint,
} from '@/lib/openai-config'

/**
 * Maps pipeline errors to a stored `processingError` string. Always prefers the
 * real API message; only adds focused hints (avoid matching generic "vector" text).
 */
export function formatUploadProcessingError(rawMessage: string): string {
  const msg = rawMessage.trim().slice(0, 1500)

  if (
    /Resource .* not found|Missing PINECONE_ENVIRONMENT|PineconeClient: Error calling describeIndex/i.test(
      rawMessage
    )
  ) {
    return `${msg}\n\n---\n${pineconeEnvironmentSetupHint()}`
  }

  /** True index vs embedding size mismatch — not every error that mentions "vector" */
  const likelyIndexDimensionMismatch =
    /has dimension \d+ but embeddings require|embeddings require \d+|dimension mismatch|does not match the index dimension|index dimension|must match.*dimension|invalid.*dimension|wrong dimension/i.test(
      rawMessage
    )

  if (likelyIndexDimensionMismatch) {
    return `${msg}\n\n---\n${pineconeDimensionSetupHint()}`
  }

  if (/rate limit|429|insufficient_quota|billing/i.test(rawMessage)) {
    return `${msg}\n\n---\nOpenAI returned a quota or rate error — check your API key and billing at platform.openai.com.`
  }

  return msg
}
