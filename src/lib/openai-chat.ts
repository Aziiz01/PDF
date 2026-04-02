import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { OPENAI_CHAT_MODEL } from '@/lib/openai-config'

export { OPENAI_CHAT_MODEL }

const SYSTEM_INSTRUCTIONS = `You are a helpful assistant. Answer in markdown using the CONTEXT below when it is relevant. If the answer is not in the context, say you don't know.`

export function buildOpenAiMessages(
  contextBlock: string,
  prevMessages: { isUserMessage: boolean; text: string }[]
): ChatCompletionMessageParam[] {
  const systemContent =
    contextBlock.trim().length > 0
      ? `${SYSTEM_INSTRUCTIONS}\n\n----------------\nCONTEXT:\n${contextBlock}\n----------------`
      : SYSTEM_INSTRUCTIONS

  const out: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
  ]

  for (const msg of prevMessages) {
    out.push({
      role: msg.isUserMessage ? 'user' : 'assistant',
      content: msg.text,
    })
  }

  return out
}
