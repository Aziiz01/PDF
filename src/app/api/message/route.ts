import { db } from '@/db'
import { getPineconeIndex } from '@/lib/pinecone'
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator'
import { getAuthUser } from '@/lib/auth'
import { createHuggingFaceEmbeddings } from '@/lib/hf-embeddings'
import { buildChatPrompt } from '@/lib/hf-chat'
import { HfInference } from '@huggingface/inference'
import { getHfApiKey, HF_CHAT_MODEL } from '@/lib/hf-config'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { NextRequest } from 'next/server'

import { HuggingFaceStream, StreamingTextResponse } from 'ai'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const user = await getAuthUser()
  const userId = user?.id

  if (!userId)
    return new Response('Unauthorized', { status: 401 })

  const { fileId, message } =
    SendMessageValidator.parse(body)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  })

  if (!file)
    return new Response('Not found', { status: 404 })

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  })

  try {
    const embeddings = createHuggingFaceEmbeddings()

    const pineconeIndex = await getPineconeIndex()

    const vectorStore = await PineconeStore.fromExistingIndex(
      embeddings,
      {
        pineconeIndex,
        namespace: file.id,
      }
    )

    const results = await vectorStore.similaritySearch(
      message,
      4
    )

    const prevMessages = await db.message.findMany({
      where: {
        fileId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 6,
    })

    const formattedPrevMessages = prevMessages.map(
      (msg) => ({
        role: msg.isUserMessage
          ? ('user' as const)
          : ('assistant' as const),
        content: msg.text,
      })
    )

    const conversationBlock = formattedPrevMessages
      .map((m) => {
        if (m.role === 'user')
          return `User: ${m.content}\n`
        return `Assistant: ${m.content}\n`
      })
      .join('')

    const contextBlock = results
      .map((r) => r.pageContent)
      .join('\n\n')

    const prompt = buildChatPrompt(
      contextBlock,
      conversationBlock,
      message
    )

    const hf = new HfInference(getHfApiKey())
    const hfStream = hf.textGenerationStream({
      model: HF_CHAT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.2,
        return_full_text: false,
        top_p: 0.9,
      },
    })

    const stream = HuggingFaceStream(hfStream, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          },
        })
      },
    })

    return new StreamingTextResponse(stream)
  } catch (err) {
    console.error('[POST /api/message]', err)
    const msg =
      err instanceof Error ? err.message : 'Chat failed'
    return new Response(msg, { status: 502 })
  }
}
