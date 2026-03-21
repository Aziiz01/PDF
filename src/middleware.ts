import { authMiddleware } from '@kinde-oss/kinde-auth-nextjs/server'

export const config = {
  matcher: [], // Auth bypassed for now - dashboard accessible without login
}

export default authMiddleware
