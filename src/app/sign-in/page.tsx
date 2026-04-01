import { Suspense } from 'react'
import SignInForm from './SignInForm'

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className='mx-auto mt-24 max-w-sm text-center text-sm text-zinc-600'>
          Loading…
        </div>
      }>
      <SignInForm />
    </Suspense>
  )
}
