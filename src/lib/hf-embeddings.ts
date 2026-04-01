import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf'
import { getHfApiKey, HF_EMBEDDING_MODEL } from '@/lib/hf-config'

/**
 * HF Inference chokes or hangs if we send dozens of page texts in one
 * `featureExtraction` call (LangChain's default). Batch instead.
 */
const EMBED_BATCH_SIZE = 8

class BatchedHuggingFaceEmbeddings extends HuggingFaceInferenceEmbeddings {
  async embedDocuments(texts: string[]): Promise<number[][]> {
    const out: number[][] = []
    for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
      const batch = texts.slice(i, i + EMBED_BATCH_SIZE)
      const vectors = await super.embedDocuments(batch)
      out.push(...vectors)
    }
    return out
  }
}

export function createHuggingFaceEmbeddings() {
  return new BatchedHuggingFaceEmbeddings({
    model: HF_EMBEDDING_MODEL,
    apiKey: getHfApiKey(),
  })
}
