'use client'

import { trpc } from '@/app/_trpc/client'
import ChatInput from './ChatInput'
import Messages from './Messages'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'
import { ChatDock } from './ChatDock'
import { useEffect, useState } from 'react'

interface ChatWrapperProps {
  fileId: string
  isSubscribed: boolean
}

const SLOW_PROCESSING_MS = 30_000

const ChatWrapper = ({
  fileId,
  isSubscribed,
}: ChatWrapperProps) => {
  const [processingSlow, setProcessingSlow] =
    useState(false)

  const { data, isLoading } =
    trpc.getFileUploadStatus.useQuery(
      {
        fileId,
      },
      {
        refetchInterval: (data) =>
          data?.status === 'SUCCESS' ||
          data?.status === 'FAILED'
            ? false
            : 500,
      }
    )

  useEffect(() => {
    if (data?.status !== 'PROCESSING') {
      setProcessingSlow(false)
      return
    }
    const t = setTimeout(
      () => setProcessingSlow(true),
      SLOW_PROCESSING_MS
    )
    return () => clearTimeout(t)
  }, [data?.status, fileId])

  if (isLoading)
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Loading...
            </h3>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  if (data?.status === 'PROCESSING')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Processing PDF...
            </h3>
            {processingSlow ? (
              <p className='text-zinc-500 text-xs mt-2 max-w-xs text-center'>
                Large files can take a few minutes.
              </p>
            ) : null}
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  if (data?.status === 'FAILED')
    return (
      <ChatContextProvider fileId={fileId}>
        <div className='relative min-h-full bg-zinc-50 flex flex-col'>
          <div className='flex-1 flex justify-center items-center flex-col px-3 pb-52 pt-8'>
            <div className='flex flex-col items-center gap-3 text-center max-w-sm'>
              <XCircle className='h-8 w-8 text-amber-500' />
              <h3 className='font-semibold text-lg'>
                Something went wrong
              </h3>
              <p className='text-zinc-600 text-sm line-clamp-6 whitespace-pre-wrap'>
                {(data as { processingError?: string | null })
                  .processingError ??
                  'Processing failed. Add your OpenAI key and check Pinecone, then upload again.'}
              </p>
              <p className='text-zinc-400 text-xs'>
                Re-upload from the dashboard after fixing setup.
              </p>
              <Link
                href='/dashboard'
                className={buttonVariants({
                  variant: 'secondary',
                  className: 'mt-1',
                })}>
                <ChevronLeft className='h-3 w-3 mr-1.5' />
                Dashboard
              </Link>
            </div>
          </div>

          <ChatDock />
        </div>
      </ChatContextProvider>
    )

  return (
    <ChatContextProvider fileId={fileId}>
      <div className='relative min-h-full bg-zinc-50 flex flex-col'>
        <div className='flex-1 flex flex-col mb-44 min-h-0'>
          <Messages fileId={fileId} />
        </div>

        <ChatDock />
      </div>
    </ChatContextProvider>
  )
}

export default ChatWrapper
