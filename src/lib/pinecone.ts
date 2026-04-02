import { PineconeClient } from '@pinecone-database/pinecone'
import {
  getExpectedEmbeddingDimensions,
  getPineconeEnvironment,
  getPineconeIndexName,
  pineconeDimensionSetupHint,
} from '@/lib/openai-config'

export const getPineconeClient = async () => {
  const client = new PineconeClient()

  await client.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: getPineconeEnvironment(),
  })

  return client
}

/** Avoid repeated describeIndex calls per index name in one process */
let validatedDimensionForIndex: string | null = null

async function assertPineconeIndexDimension(client: PineconeClient) {
  const name = getPineconeIndexName()
  if (validatedDimensionForIndex === name) return

  const expected = getExpectedEmbeddingDimensions()
  const meta = await client.describeIndex({ indexName: name })
  const raw = meta.database?.dimension
  if (raw !== undefined && raw !== null) {
    const actual = Number.parseInt(String(raw), 10)
    if (Number.isFinite(actual) && actual !== expected) {
      throw new Error(
        `Pinecone index "${name}" has dimension ${actual} but embeddings require ${expected}. ${pineconeDimensionSetupHint()}`
      )
    }
  }

  validatedDimensionForIndex = name
}

export async function getPineconeIndex() {
  const client = await getPineconeClient()
  await assertPineconeIndexDimension(client)
  return client.Index(getPineconeIndexName())
}
