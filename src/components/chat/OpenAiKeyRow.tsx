'use client'

import { trpc } from '@/app/_trpc/client'
import { useToast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Loader2, KeyRound } from 'lucide-react'
import { useState } from 'react'

/** Single bottom row: API key + Save. No long copy. */
export function OpenAiKeyRow() {
  const { toast } = useToast()
  const [keyInput, setKeyInput] = useState('')
  const [editing, setEditing] = useState(false)

  const { data, isLoading, refetch } =
    trpc.getAiProviderSettings.useQuery()

  const saveKeyMutation = trpc.setOpenAiApiKey.useMutation()
  const clearKeyMutation = trpc.clearOpenAiApiKey.useMutation()

  const hasKey = data?.hasOpenAiKey
  const showField = !hasKey || editing

  async function handleSave() {
    try {
      await saveKeyMutation.mutateAsync({
        apiKey: keyInput.trim(),
      })
      setKeyInput('')
      setEditing(false)
      await refetch()
      toast({ title: 'Saved' })
    } catch (e) {
      toast({
        title: 'Could not save',
        description:
          e instanceof Error ? e.message : 'Try again',
        variant: 'destructive',
      })
    }
  }

  const saving = saveKeyMutation.isLoading

  if (!showField && hasKey) {
    return (
      <div className='flex items-center justify-between gap-2 text-xs text-emerald-700'>
        <span className='truncate'>OpenAI key on file</span>
        <button
          type='button'
          className='text-violet-600 hover:underline shrink-0'
          onClick={() => {
            setEditing(true)
            setKeyInput('')
          }}>
          Change
        </button>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <KeyRound
        className='h-4 w-4 shrink-0 text-violet-500'
        aria-hidden
      />
      <Input
        type='password'
        autoComplete='off'
        placeholder='OpenAI API key'
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
        disabled={isLoading}
        className='h-9 flex-1 text-sm'
      />
      <Button
        type='button'
        size='sm'
        className='shrink-0 bg-violet-600 hover:bg-violet-700'
        disabled={saving || keyInput.trim().length < 20}
        onClick={() => void handleSave()}>
        {saving ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          'Save'
        )}
      </Button>
      {hasKey && editing ? (
        <Button
          type='button'
          size='sm'
          variant='ghost'
          className='shrink-0 px-2'
          disabled={clearKeyMutation.isLoading}
          onClick={async () => {
            await clearKeyMutation.mutateAsync()
            await refetch()
            setEditing(false)
          }}>
          Remove
        </Button>
      ) : null}
    </div>
  )
}
