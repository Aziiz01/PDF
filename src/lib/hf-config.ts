/**
 * Hugging Face Inference API (free tier: create a token at huggingface.co/settings/tokens).
 *
 * Embeddings: default all-MiniLM-L6-v2 → vector size 384.
 * Your Pinecone index must match that dimension (or change HF_EMBEDDING_MODEL + recreate index).
 */

export const HF_EMBEDDING_MODEL =
  process.env.HF_EMBEDDING_MODEL ??
  'sentence-transformers/all-MiniLM-L6-v2'

/**
 * Output size of HF_EMBEDDING_MODEL vectors. Must match the Pinecone index
 * `dimension` (set at index creation; cannot be changed in place).
 * Default 384 for all-MiniLM-L6-v2. If you switch models, set this to the new size and create a new index.
 */
export function getExpectedEmbeddingDimensions(): number {
  const raw = process.env.EMBEDDING_VECTOR_SIZE ?? '384'
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 384
}

/** User-facing hint when index dimension ≠ embedding size */
export function pineconeDimensionSetupHint(): string {
  const dim = getExpectedEmbeddingDimensions()
  return (
    `In the Pinecone console, create an index with dimension ${dim} and metric cosine (or dotproduct). ` +
    `Set PINECONE_INDEX_NAME in .env to that index name. ` +
    `Embeddings use ${HF_EMBEDDING_MODEL} (${dim}-dim vectors). ` +
    `Indexes built for other models (e.g. 1536-dim OpenAI) cannot be reused unless you change HF_EMBEDDING_MODEL and EMBEDDING_VECTOR_SIZE to match.`
  )
}

/**
 * Stronger default: Mistral 7B Instruct (good quality on HF Inference).
 * Override with e.g. HuggingFaceH4/zephyr-7b-beta, meta-llama/Meta-Llama-3-8B-Instruct (if access).
 */
export const HF_CHAT_MODEL =
  process.env.HF_CHAT_MODEL ??
  'mistralai/Mistral-7B-Instruct-v0.2'

export type HfChatPromptFormat =
  | 'mistral'
  | 'tinyllama'
  | 'zephyr'
  | 'llama3'
  | 'plain'

/**
 * How to wrap the RAG prompt for `textGenerationStream`.
 * Set HF_CHAT_PROMPT_FORMAT if auto-detect is wrong for your model.
 */
export function getHfChatPromptFormat(): HfChatPromptFormat {
  const explicit = process.env.HF_CHAT_PROMPT_FORMAT?.toLowerCase()
  if (
    explicit === 'mistral' ||
    explicit === 'tinyllama' ||
    explicit === 'zephyr' ||
    explicit === 'llama3' ||
    explicit === 'plain'
  ) {
    return explicit
  }

  const m = (process.env.HF_CHAT_MODEL ?? HF_CHAT_MODEL).toLowerCase()
  if (m.includes('tinyllama')) return 'tinyllama'
  if (m.includes('zephyr')) return 'zephyr'
  if (m.includes('llama-3') || m.includes('meta-llama-3'))
    return 'llama3'
  if (m.includes('mistral')) return 'mistral'
  return 'mistral'
}

export function getHfApiKey(): string {
  const key =
    process.env.HUGGINGFACE_API_KEY ??
    process.env.HUGGINGFACEHUB_API_KEY
  if (!key?.trim()) {
    throw new Error(
      'Missing HUGGINGFACE_API_KEY (or HUGGINGFACEHUB_API_KEY). Create a free token at https://huggingface.co/settings/tokens'
    )
  }
  return key.trim()
}

export function getPineconeIndexName(): string {
  return process.env.PINECONE_INDEX_NAME ?? 'quill'
}
