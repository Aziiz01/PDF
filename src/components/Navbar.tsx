import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'
import { Icons } from './Icons'
import { getAuthUser } from '@/lib/auth'
import { getUserSubscriptionPlan } from '@/lib/stripe'

const Navbar = async () => {
  const user = await getAuthUser()
  const subscriptionPlan = user
    ? await getUserSubscriptionPlan()
    : { isSubscribed: false }

  const displayName = user?.name ?? user?.email ?? 'Your Account'

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-violet-100 bg-white/80 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between'>
          <Link
            href='/'
            className='flex z-40 font-semibold items-center'>
            <Icons.logo className='h-5 w-5' />
            <span className='ml-1.5 text-violet-700'>PDFSnap</span>
          </Link>

          <MobileNav isAuth={!!user} />

          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Pricing
                </Link>
                <Link
                  href='/sign-in'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Sign in
                </Link>
                <Link
                  href='/register'
                  className={buttonVariants({
                    size: 'sm',
                  })}>
                  Get started{' '}
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>

                <UserAccountNav
                  name={displayName}
                  email={user.email}
                  subscriptionPlan={subscriptionPlan}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
