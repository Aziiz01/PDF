import { getHfChatPromptFormat } from '@/lib/hf-config'

function buildCorePrompt(
  contextBlock: string,
  conversationBlock: string,
  userMessage: string
): string {
  return `You are a helpful assistant. Answer in markdown using the context and conversation below. If the answer is not in the context, say you don't know.

----------------
CONTEXT:
${contextBlock}

----------------
PREVIOUS CONVERSATION:
${conversationBlock}

----------------
USER QUESTION:
${userMessage}`
}

/**
 * Formats the RAG prompt for the active HF_CHAT_MODEL (see HF_CHAT_PROMPT_FORMAT).
 */
export function buildChatPrompt(
  contextBlock: string,
  conversationBlock: string,
  userMessage: string
): string {
  const core = buildCorePrompt(
    contextBlock,
    conversationBlock,
    userMessage
  )
  const format = getHfChatPromptFormat()

  switch (format) {
    case 'mistral':
      // Mistral 7B Instruct
      return `<s>[INST] ${core} [/INST]`
    case 'tinyllama':
      return `<|user|>
${core}
<|assistant|>
`
    case 'zephyr':
      return `<|system|>
Answer in markdown using the context when possible. Say you don't know if unsure.
<|user|>
${core}
<|assistant|>
`
    case 'llama3':
      // Llama 3.x chat template (user → assistant)
      return `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

${core}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`
    case 'plain':
    default:
      return core
  }
}
