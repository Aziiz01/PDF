import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { Loader2, MessageSquare } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import Message from './Message'
import { useContext, useEffect, useRef } from 'react'
import { ChatContext } from './ChatContext'
import { useIntersection } from '@mantine/hooks'

const KEY_PROMPT_MESSAGE = {
  createdAt: new Date(0).toISOString(),
  id: 'key-prompt',
  isUserMessage: false,
  text: `Your PDF is loaded, indexed, and standing by.\n\nI'm ready to answer questions, surface key insights, decode dense paragraphs, and generally make this document work for you — not the other way around.\n\nOne thing first: I need your **OpenAI API key**. Without it, I'm just a very well-read search box.\n\nType your key below to get started. It begins with \`sk-\`.`,
}

interface MessagesProps {
  fileId: string
  processingError?: string | null
}

function makeErrorMessage(error: string) {
  return {
    createdAt: new Date(1).toISOString(),
    id: 'processing-error',
    isUserMessage: false,
    text: `Ran into a problem while processing this PDF.\n\n${error}\n\nOnce you've sorted that out, head back to your **dashboard** and upload the file again — I'll be here.`,
  }
}

const Messages = ({ fileId, processingError }: MessagesProps) => {
  const { isLoading: isAiThinking } =
    useContext(ChatContext)

  const { data: ai } = trpc.getAiProviderSettings.useQuery()
  const hasOpenAiKey = ai?.hasOpenAiKey

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage?.nextCursor,
        keepPreviousData: true,
      }
    )

  const messages = data?.pages.flatMap(
    (page) => page.messages
  )

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className='flex h-full items-center justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </span>
    ),
  }

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
    ...(processingError && !isLoading ? [makeErrorMessage(processingError)] : []),
    ...(!hasOpenAiKey && !processingError && !isLoading ? [KEY_PROMPT_MESSAGE] : []),
  ]

  const lastMessageRef = useRef<HTMLDivElement>(null)

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  return (
    <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                message={message}
                isNextMessageSamePerson={
                  isNextMessageSamePerson
                }
                key={message.id}
              />
            )
          } else
            return (
              <Message
                message={message}
                isNextMessageSamePerson={
                  isNextMessageSamePerson
                }
                key={message.id}
              />
            )
        })
      ) : isLoading ? (
        <div className='w-full flex flex-col gap-2'>
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
        </div>
      ) : (
        <div className='flex-1 flex flex-col items-center justify-center gap-2'>
          <MessageSquare className='h-8 w-8 text-blue-500' />
          <h3 className='font-semibold text-xl'>
            You&apos;re all set!
          </h3>
          <p className='text-zinc-500 text-sm'>
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  )
}

export default Messages
