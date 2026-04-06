'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Brain, Database, Zap, CreditCard, UploadCloud, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

/* ── intersection observer hook ── */
function useInView(threshold = 0.06) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ── data ── */
const pipeline = [
  'PDF Upload', 'Text Chunking', 'OpenAI Embeddings',
  'Pinecone Upsert', 'Similarity Search', 'Context Injection', 'GPT Answer',
]

const cards = [
  {
    Icon: Brain, label: 'Vector Embeddings', accent: 'violet',
    description: "Every PDF is split into semantic chunks and passed through OpenAI's embedding model, producing 1 536-dimensional vectors that capture meaning — not just keywords — for precise retrieval.",
  },
  {
    Icon: Database, label: 'Pinecone Vector DB', accent: 'cyan',
    description: 'Vectors are upserted into Pinecone with per-document namespaces for clean multi-tenant isolation. Cosine similarity search retrieves the top-k relevant chunks in single-digit milliseconds.',
  },
  {
    Icon: Zap, label: 'OpenAI GPT — RAG', accent: 'amber',
    description: 'Retrieved chunks are injected into a carefully engineered system prompt so the model answers from the document itself, not from hallucination. Responses stream token-by-token for instant feedback.',
  },
  {
    Icon: CreditCard, label: 'Stripe Billing', accent: 'emerald',
    description: 'Full Checkout and Customer Portal integration with signed webhook handling for subscription lifecycle events. Plan limits are enforced server-side at both the upload and query layers.',
  },
  {
    Icon: UploadCloud, label: 'Serverless Ingestion', accent: 'orange',
    description: "Files land on UploadThing's CDN via presigned URLs. A serverless callback then triggers chunking, embedding, and Pinecone indexing asynchronously — the user never waits for the pipeline.",
  },
  {
    Icon: ShieldCheck, label: 'Edge-enforced Auth', accent: 'pink',
    description: 'HS256-signed JWTs live in httpOnly cookies. Route protection runs in Next.js middleware at the Edge before any server component executes — zero auth logic leaks to the client.',
  },
]

const accentMap: Record<string, { text: string; bg: string; border: string; iconBg: string }> = {
  violet:  { text: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200',  iconBg: 'bg-violet-100'  },
  cyan:    { text: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    iconBg: 'bg-cyan-100'    },
  amber:   { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   iconBg: 'bg-amber-100'   },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100' },
  orange:  { text: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200',  iconBg: 'bg-orange-100'  },
  pink:    { text: 'text-pink-600',    bg: 'bg-pink-50',    border: 'border-pink-200',    iconBg: 'bg-pink-100'    },
}

const stats = [
  { value: '1 536', label: 'Embedding dimensions' },
  { value: 'k-NN',  label: 'Vector similarity search' },
  { value: 'Edge',  label: 'Auth middleware layer' },
  { value: '100%',  label: 'Custom-built — no boilerplate' },
]

/* ── component ── */
export function HeroSection() {
  const { ref, inView } = useInView()

  const anim = (delay: number): React.CSSProperties => ({
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(22px)',
  })

  return (
    <div className='relative isolate overflow-hidden'>

      {/* shared gradient blob — top */}
      <div aria-hidden className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
        <div
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a78bfa] to-[#67e8f9] opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
        />
      </div>

      {/* ── HERO COPY ── */}
      <div className='mx-auto max-w-4xl px-6 pt-28 pb-12 sm:pt-40 sm:pb-16 text-center'>
        <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-violet-200 bg-violet-50 px-7 py-2 shadow-sm transition-all hover:border-violet-300 hover:bg-violet-100'>
          <p className='text-sm font-semibold text-violet-700'>PDFSnap is now public!</p>
        </div>

        <h1 className='mt-4 text-5xl font-bold md:text-6xl lg:text-7xl'>
          Chat with your{' '}
          <span className='text-violet-600'>documents</span>{' '}
          in seconds.
        </h1>

        <p className='mt-5 max-w-prose mx-auto text-zinc-600 sm:text-lg'>
          PDFSnap lets you have real conversations with any PDF.
          Upload your file and start asking questions instantly.
        </p>

        <Link className={buttonVariants({ size: 'lg', className: 'mt-6' })} href='/register'>
          Get started <ArrowRight className='ml-2 h-5 w-5' />
        </Link>
      </div>

      {/* ── DASHBOARD PREVIEW ── */}
      <div className='mx-auto max-w-6xl px-6 lg:px-8'>
        <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
          <Image
            src='/dashboard-preview.jpg'
            alt='product preview'
            width={1364}
            height={866}
            quality={100}
            className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
          />
        </div>
      </div>

      {/* shared gradient blob — bottom */}
      <div aria-hidden className='pointer-events-none absolute inset-x-0 top-[calc(100%-20rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]'>
        <div
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#a78bfa] to-[#67e8f9] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
        />
      </div>

      {/* ── DIVIDER ── */}
      <div className='mx-auto max-w-6xl px-6 lg:px-8 mt-24'>
        <div className='flex items-center gap-4'>
          <div className='flex-1 h-px bg-gray-200' />
          <span className='text-[11px] font-semibold uppercase tracking-widest text-gray-400'>
            Under the hood
          </span>
          <div className='flex-1 h-px bg-gray-200' />
        </div>
      </div>

      {/* ── TECH SECTION ── */}
      <div ref={ref} className='mx-auto max-w-6xl px-6 lg:px-8 py-20'>

        {/* header */}
        <div className='mx-auto max-w-2xl text-center' style={anim(0)}>
          <h2 className='text-4xl font-bold text-gray-900 sm:text-5xl leading-tight'>
            Production-grade AI,{' '}
            <span className='text-violet-600'>built from scratch</span>
          </h2>
          <p className='mt-3 text-gray-500 text-lg'>
            by <span className='font-semibold text-gray-900'>Mohamed Aziz Nacib</span>
          </p>
          <p className='mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto'>
            Every layer was individually integrated — from vector ingestion to billing
            webhooks — with production concerns like multi-tenancy, streaming, and
            edge security in mind.
          </p>
        </div>

        {/* pipeline */}
        <div className='mt-14' style={anim(120)}>
          <p className='text-center text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-5'>
            RAG Pipeline — how a question becomes an answer
          </p>
          <div className='flex items-center justify-center flex-wrap gap-1.5'>
            {pipeline.map((step, i) => (
              <div key={step} className='flex items-center gap-1.5'>
                <div className='rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 whitespace-nowrap hover:bg-violet-100 transition-colors'>
                  {step}
                </div>
                {i < pipeline.length - 1 && (
                  <ArrowRight className='h-3.5 w-3.5 shrink-0 text-violet-400' />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* cards */}
        <div className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {cards.map(({ Icon, label, accent, description }, i) => {
            const a = accentMap[accent]
            return (
              <div
                key={label}
                style={anim(220 + i * 80)}
                className={`rounded-xl border ${a.border} ${a.bg} p-6 hover:shadow-md transition-shadow duration-300`}>
                <div className={`inline-flex items-center justify-center rounded-lg ${a.iconBg} p-2.5 mb-4`}>
                  <Icon className={`h-5 w-5 ${a.text}`} />
                </div>
                <h3 className='text-gray-900 font-semibold text-sm mb-2'>{label}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{description}</p>
              </div>
            )
          })}
        </div>

        {/* stats */}
        <div className='mt-12' style={anim(740)}>
          <div className='rounded-2xl border border-gray-200 bg-gray-50 px-8 py-7 grid grid-cols-2 gap-6 sm:grid-cols-4 text-center'>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className='text-2xl font-bold text-violet-600'>{value}</p>
                <p className='mt-1 text-xs text-gray-500'>{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
