'use client'

import ChatInput from './ChatInput'
import { OpenAiKeyRow } from './OpenAiKeyRow'
import { trpc } from '@/app/_trpc/client'

/**
 * Bottom bar: OpenAI key row + chat input together (no separate header strip).
 */
export function ChatDock() {
  const { data: ai } = trpc.getAiProviderSettings.useQuery()

  return (
    <div className='absolute bottom-0 left-0 right-0 z-10 border-t border-zinc-200/80 bg-zinc-50/95 backdrop-blur-sm'>
      <div className='mx-auto max-w-3xl px-3 pb-4 pt-3 md:px-4'>
        <div className='space-y-3 rounded-xl border border-zinc-200/60 bg-white p-3 shadow-sm'>
          <OpenAiKeyRow />
          <ChatInput
            embedded
            isDisabled={!ai?.hasOpenAiKey}
          />
        </div>
      </div>
    </div>
  )
}
