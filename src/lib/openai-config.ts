/**
 * OpenAI-only showcase: embeddings + chat use the user’s saved API key (Billing page).
 * Pinecone index dimension must match embedding output (default 1536 for text-embedding-3-small).
 */

export const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small'

export const OPENAI_CHAT_MODEL =
  process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini'

/**
 * Vector size for OPENAI_EMBEDDING_MODEL; must equal Pinecone index dimension.
 * Default 1536 for text-embedding-3-small (default API output).
 */
export function getExpectedEmbeddingDimensions(): number {
  const raw = process.env.EMBEDDING_VECTOR_SIZE ?? '1536'
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 1536
}

export function pineconeDimensionSetupHint(): string {
  const dim = getExpectedEmbeddingDimensions()
  return (
    `In Pinecone, create an index with dimension ${dim} and metric cosine. ` +
    `Set PINECONE_INDEX_NAME in .env. Embeddings use ${OPENAI_EMBEDDING_MODEL} (${dim}-dim by default). ` +
    `If you use a different embedding model or the dimensions API, set EMBEDDING_VECTOR_SIZE to match.`
  )
}

export function pineconeEnvironmentSetupHint(): string {
  return (
    `Set PINECONE_ENVIRONMENT in .env to the Environment value from Pinecone Console → API Keys. ` +
    `Restart the dev server after changing .env.`
  )
}

export function getPineconeIndexName(): string {
  return process.env.PINECONE_INDEX_NAME ?? 'pdf-snap'
}

export function getPineconeEnvironment(): string {
  const e = process.env.PINECONE_ENVIRONMENT?.trim()
  if (!e) {
    throw new Error(
      'Missing PINECONE_ENVIRONMENT. In https://app.pinecone.io open your project → API Keys: copy the Environment value and add PINECONE_ENVIRONMENT=... to .env, then restart the dev server.'
    )
  }
  return e
}
