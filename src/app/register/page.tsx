'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setAlreadyExists(false)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) {
        if (res.status === 409) setAlreadyExists(true)
        setError(data.error ?? 'Registration failed.')
        return
      }
      window.location.assign('/dashboard')
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MaxWidthWrapper className='flex min-h-[70vh] flex-col items-center justify-center'>
      <div className='mx-auto w-full max-w-sm flex flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-bold text-zinc-900'>
            Create an account
          </h1>
          <p className='mt-2 text-sm text-zinc-600'>
            Password must be at least 8 characters.
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='reg-email'
              className='text-sm font-medium leading-none'>
              Email
            </label>
            <Input
              id='reg-email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <label
              htmlFor='reg-password'
              className='text-sm font-medium leading-none'>
              Password
            </label>
            <Input
              id='reg-password'
              type='password'
              autoComplete='new-password'
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? (
            <div className='space-y-1'>
              <p className='text-sm text-red-600' role='alert'>
                {error}
              </p>
              {alreadyExists ? (
                <p className='text-sm text-zinc-600'>
                  <Link
                    href={`/sign-in?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                    className='font-medium text-blue-600 underline-offset-2 hover:underline'>
                    Sign in instead
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}

          <button
            type='submit'
            disabled={loading}
            className={buttonVariants({ className: 'w-full' })}>
            {loading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className='text-center text-sm text-zinc-600'>
          Already have an account?{' '}
          <Link
            href='/sign-in'
            className='font-medium text-blue-600 underline-offset-2 hover:underline'>
            Sign in
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
