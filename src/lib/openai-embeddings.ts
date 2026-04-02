import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OPENAI_EMBEDDING_MODEL } from '@/lib/openai-config'

export function createOpenAiEmbeddings(openAIApiKey: string) {
  return new OpenAIEmbeddings({
    openAIApiKey,
    modelName: OPENAI_EMBEDDING_MODEL,
    maxConcurrency: 3,
  })
}
