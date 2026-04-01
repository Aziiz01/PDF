'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { getSafeRedirectPath } from '@/lib/utils'

export default function SignInForm() {
  const searchParams = useSearchParams()
  const from = getSafeRedirectPath(
    searchParams.get('from') ?? '/dashboard'
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const emailNorm = email.trim().toLowerCase()
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailNorm,
          password,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Sign in failed')
        return
      }
      // Full navigation so the session cookie is always sent on the next request
      window.location.assign(from)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MaxWidthWrapper className='flex min-h-[70vh] flex-col items-center justify-center'>
      <div className='mx-auto w-full max-w-sm flex flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-bold text-zinc-900'>
            Sign in
          </h1>
          <p className='mt-2 text-sm text-zinc-600'>
            Use the account you registered for this showcase.
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium leading-none'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <label
              htmlFor='password'
              className='text-sm font-medium leading-none'>
              Password
            </label>
            <Input
              id='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className='text-sm text-red-600' role='alert'>
              {error}
            </p>
          ) : null}
          <button
            type='submit'
            disabled={loading}
            className={buttonVariants({
              className: 'w-full',
            })}>
            {loading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className='text-center text-sm text-zinc-600'>
          No account?{' '}
          <Link
            href='/register'
            className='font-medium text-blue-600 underline-offset-2 hover:underline'>
            Register
          </Link>
        </p>

        <Link
          href='/'
          className={buttonVariants({
            variant: 'secondary',
            className: 'w-full',
          })}>
          <ChevronLeft className='mr-1.5 h-4 w-4' />
          Back to Home
        </Link>
      </div>
    </MaxWidthWrapper>
  )
}
