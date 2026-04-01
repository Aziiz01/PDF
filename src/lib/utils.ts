import { type ClassValue, clsx } from 'clsx'
import { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${
    process.env.PORT ?? 3000
  }${path}`
}

/**
 * Post-login redirect: only same-origin relative paths.
 * Rejects `//evil.com` (starts with `/` but is a protocol-relative URL).
 */
export function getSafeRedirectPath(
  from: string | null | undefined
): string {
  if (!from || typeof from !== 'string') return '/dashboard'
  const t = from.trim()
  if (!t.startsWith('/') || t.startsWith('//'))
    return '/dashboard'
  return t
}

export function constructMetadata({
  title = "PDFSnap - the SaaS for students",
  description = "PDFSnap is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@joshtriedcoding"
    },
    icons,
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}