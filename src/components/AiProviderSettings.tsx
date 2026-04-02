'use client'

import { trpc } from '@/app/_trpc/client'
import { useToast } from './ui/use-toast'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'

const AiProviderSettings = () => {
  const { toast } = useToast()
  const [keyInput, setKeyInput] = useState('')

  const { data, isLoading, refetch } =
    trpc.getAiProviderSettings.useQuery()

  const saveKeyMutation = trpc.setOpenAiApiKey.useMutation()
  const clearKeyMutation = trpc.clearOpenAiApiKey.useMutation()

  const hasKey = data?.hasOpenAiKey

  async function handleSave() {
    try {
      await saveKeyMutation.mutateAsync({
        apiKey: keyInput.trim(),
      })
      setKeyInput('')
      await refetch()
      toast({
        title: 'You’re all set',
        description:
          'You can upload PDFs and chat with them — have fun exploring.',
      })
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Could not save key'
      toast({
        title: 'Could not save key',
        description: msg,
        variant: 'destructive',
      })
    }
  }

  async function handleClear() {
    try {
      await clearKeyMutation.mutateAsync()
      await refetch()
      toast({
        title: 'Key removed',
        description:
          'Add a key again anytime to use AI on your files.',
      })
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Something went wrong'
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive',
      })
    }
  }

  const saving = saveKeyMutation.isLoading
  const clearing = clearKeyMutation.isLoading

  return (
    <Card className='mt-8 overflow-hidden border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-amber-50/40 shadow-sm'>
      <CardHeader className='space-y-3 pb-2'>
        <div className='flex items-center gap-2 text-violet-700'>
          <Sparkles className='h-5 w-5 shrink-0' aria-hidden />
          <CardTitle className='text-lg font-semibold tracking-tight'>
            OpenAI — showcase mode
          </CardTitle>
        </div>
        <CardDescription className='text-base leading-relaxed text-zinc-600'>
          This is a <span className='font-medium text-zinc-800'>demo</span>.
          Since it’s a showcase, you can paste your own{' '}
          <span className='font-medium text-violet-800'>
            OpenAI API key
          </span>{' '}
          to have fun chatting with your PDFs — search, ask questions, and
          see what RAG can do. Your key is stored encrypted and only used
          for your account.
        </CardDescription>
      </CardHeader>
      <CardFooter className='flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-end'>
        <div className='flex-1 space-y-2 w-full'>
          <label
            htmlFor='openai-key'
            className='text-sm font-medium text-zinc-800'>
            API key{' '}
            {hasKey ? (
              <span className='font-normal text-emerald-600'>
                — saved, you’re ready to go
              </span>
            ) : (
              <span className='font-normal text-zinc-500'>
                — add one to unlock AI
              </span>
            )}
          </label>
          <Input
            id='openai-key'
            type='password'
            autoComplete='off'
            placeholder='sk-...'
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            disabled={isLoading}
            className='border-violet-200/80 bg-white/80'
          />
          <p className='text-xs text-zinc-500'>
            Get a key at{' '}
            <a
              className='text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900'
              href='https://platform.openai.com/api-keys'
              target='_blank'
              rel='noreferrer'>
              platform.openai.com/api-keys
            </a>
            . Usage is billed by OpenAI to your account.
          </p>
        </div>
        <div className='flex flex-wrap gap-2 shrink-0'>
          <Button
            type='button'
            className='bg-violet-600 hover:bg-violet-700'
            disabled={saving || keyInput.trim().length < 20}
            onClick={() => void handleSave()}>
            {saving ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Save key'
            )}
          </Button>
          {hasKey ? (
            <Button
              type='button'
              variant='outline'
              className='border-violet-200 bg-white/80'
              disabled={clearing}
              onClick={() => void handleClear()}>
              {clearing ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Remove key'
              )}
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  )
}

export default AiProviderSettings
