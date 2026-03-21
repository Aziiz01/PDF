import Dashboard from '@/components/Dashboard'
import { getUserSubscriptionPlan } from '@/lib/stripe'

const Page = async () => {
  // Auth bypassed for now - dashboard accessible without login
  const subscriptionPlan = await getUserSubscriptionPlan()

  return <Dashboard subscriptionPlan={subscriptionPlan} />
}

export default Page
