'use client'

import ChatInput from './ChatInput'
import { OpenAiKeyRow } from './OpenAiKeyRow'
import { trpc } from '@/app/_trpc/client'
import { Icons } from '../Icons'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { KeyRound, Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'

function KeyReplyDock() {
  const { toast } = useToast()
  const [keyInput, setKeyInput] = useState('')
  const { refetch } = trpc.getAiProviderSettings.useQuery()
  const saveKeyMutation = trpc.setOpenAiApiKey.useMutation()
  const saving = saveKeyMutation.isLoading

  async function handleSave() {
    const trimmed = keyInput.trim()
    if (trimmed.length < 20) return
    try {
      await saveKeyMutation.mutateAsync({ apiKey: trimmed })
      setKeyInput('')
      await refetch()
    } catch (e) {
      toast({
        title: 'Could not save key',
        description: e instanceof Error ? e.message : 'Try again',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='absolute bottom-0 left-0 right-0 z-10 border-t border-violet-100 bg-white/95 backdrop-blur-sm'>
      <div className='mx-auto max-w-3xl px-3 pb-4 pt-3 md:px-4'>
        <div className='rounded-xl border border-violet-200 bg-violet-50/50 p-3 shadow-sm space-y-2.5'>
          {/* "replying to" header */}
          <div className='flex items-center gap-2'>
            <div className='h-5 w-5 rounded-sm bg-white ring-1 ring-zinc-900 flex items-center justify-center shrink-0'>
              <Icons.logo className='h-3/4 w-3/4' />
            </div>
            <span className='text-xs text-zinc-400 font-medium tracking-wide'>
              Replying to PDF Assistant
            </span>
          </div>

          {/* key input row */}
          <div className='flex items-center gap-2'>
            <KeyRound className='h-4 w-4 shrink-0 text-violet-500' />
            <Input
              type='password'
              autoComplete='off'
              placeholder='sk-...'
              value={keyInput}
              autoFocus
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSave()
              }}
              className='flex-1 h-10 bg-white border-violet-200 focus-visible:ring-violet-400 text-sm'
            />
            <Button
              onClick={() => void handleSave()}
              disabled={saving || keyInput.trim().length < 20}
              size='sm'
              className='shrink-0 bg-violet-600 hover:bg-violet-700 h-10 px-4'
            >
              {saving ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Bottom bar: shows key-entry when no API key is set,
 * or normal chat input once a key is on file.
 */
export function ChatDock() {
  const { data: ai } = trpc.getAiProviderSettings.useQuery()

  if (!ai?.hasOpenAiKey) {
    return <KeyReplyDock />
  }

  return (
    <div className='absolute bottom-0 left-0 right-0 z-10 border-t border-zinc-200/80 bg-zinc-50/95 backdrop-blur-sm'>
      <div className='mx-auto max-w-3xl px-3 pb-4 pt-3 md:px-4'>
        <div className='space-y-3 rounded-xl border border-zinc-200/60 bg-white p-3 shadow-sm'>
          <OpenAiKeyRow />
          <ChatInput embedded isDisabled={false} />
        </div>
      </div>
    </div>
  )
}
