import { db } from '@/db'
import { getPineconeIndex } from '@/lib/pinecone'
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator'
import { getAuthUser } from '@/lib/auth'
import { createOpenAiEmbeddings } from '@/lib/openai-embeddings'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

import { OpenAIStream, StreamingTextResponse } from 'ai'
import { buildOpenAiMessages, OPENAI_CHAT_MODEL } from '@/lib/openai-chat'
import { getUserOpenAiApiKey } from '@/lib/openai-user'

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

  const openAiKey = await getUserOpenAiApiKey(userId)
  if (!openAiKey) {
    return new Response(
      'Add your OpenAI API key to chat with your PDFs.',
      { status: 400 }
    )
  }

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  })

  try {
    const embeddings = createOpenAiEmbeddings(openAiKey)

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

    const contextBlock = results
      .map((r) => r.pageContent)
      .join('\n\n')

    const openai = new OpenAI({ apiKey: openAiKey })
    const oaMessages = buildOpenAiMessages(
      contextBlock,
      prevMessages.map((m) => ({
        isUserMessage: m.isUserMessage,
        text: m.text,
      }))
    )

    const oaStream = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: oaMessages,
      stream: true,
      temperature: 0.2,
      max_tokens: 1024,
    })

    const stream = OpenAIStream(
      oaStream as Parameters<typeof OpenAIStream>[0],
      {
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
      }
    )

    return new StreamingTextResponse(stream)
  } catch (err) {
    console.error('[POST /api/message]', err)
    const msg =
      err instanceof Error ? err.message : 'Chat failed'
    return new Response(msg, { status: 502 })
  }
}
