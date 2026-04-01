import { createNextRouteHandler } from 'uploadthing/next'

import { ourFileRouter } from './core'

/** Allow long HF + Pinecone work on Vercel (seconds). Local dev ignores this. */
export const maxDuration = 800

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
})