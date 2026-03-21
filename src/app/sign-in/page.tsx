import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function SignInPage() {
  return (
    <MaxWidthWrapper className='flex min-h-[70vh] flex-col items-center justify-center'>
      <div className='mx-auto flex max-w-md flex-col items-center text-center'>
        {/* Loader - From Uiverse.io by Nawsome */}
        <div className='loader mb-8' aria-label='Loading'>
          <div className='loader__bar' />
          <div className='loader__bar' />
          <div className='loader__bar' />
          <div className='loader__bar' />
          <div className='loader__bar' />
          <div className='loader__ball' />
        </div>

        <h1 className='text-2xl font-bold text-zinc-900'>
          Kinde API expired
        </h1>
        <p className='mt-3 text-zinc-600'>
          The login process is momentarily static. Work in progress.
        </p>
        <p className='mt-1 text-sm text-zinc-500'>
          We&apos;re updating our authentication system. Please check back soon.
        </p>

        <Link
          href='/'
          className={buttonVariants({
            variant: 'secondary',
            className: 'mt-8',
          })}
        >
          <ChevronLeft className='mr-1.5 h-4 w-4' />
          Back to Home
        </Link>
      </div>
    </MaxWidthWrapper>
  )
}
