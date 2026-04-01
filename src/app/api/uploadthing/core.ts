import { db } from '@/db'
import { getUserId } from '@/lib/auth'
import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { createHuggingFaceEmbeddings } from '@/lib/hf-embeddings'
import { getPineconeIndex } from '@/lib/pinecone'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { PLANS } from '@/config/stripe'
import { withTimeout } from '@/lib/with-timeout'
import { pineconeDimensionSetupHint } from '@/lib/hf-config'
import type { Document } from 'langchain/document'

const f = createUploadthing()

/** Whole pipeline: PDF fetch → embed → Pinecone (serverless kills long work otherwise) */
const PROCESSING_BUDGET_MS = 7 * 60 * 1000
const FETCH_PDF_MS = 2 * 60 * 1000

const middleware = async () => {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const subscriptionPlan = await getUserSubscriptionPlan()

  return { subscriptionPlan, userId }
}

async function processUploadedPdf(
  createdFileId: string,
  pageLevelDocs: Document[]
) {
  const pineconeIndex = await getPineconeIndex()
  const embeddings = createHuggingFaceEmbeddings()

  await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
    pineconeIndex,
    namespace: createdFileId,
  })

  await db.file.update({
    data: {
      uploadStatus: 'SUCCESS',
    },
    where: {
      id: createdFileId,
    },
  })
}

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  })

  if (isFileExist) return

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: file.url,
      uploadStatus: 'PROCESSING',
    },
  })

  try {
    const ac = new AbortController()
    const fetchTimer = setTimeout(
      () => ac.abort(),
      FETCH_PDF_MS
    )
    let response: Response
    try {
      response = await fetch(file.url, { signal: ac.signal })
    } finally {
      clearTimeout(fetchTimer)
    }

    if (!response.ok) {
      throw new Error(
        `Could not download PDF from storage (HTTP ${response.status}).`
      )
    }

    const blob = await response.blob()

    const loader = new PDFLoader(blob)

    const pageLevelDocs = await loader.load()

    const pagesAmt = pageLevelDocs.length

    const { subscriptionPlan } = metadata
    const { isSubscribed } = subscriptionPlan

    const isProExceeded =
      pagesAmt >
      PLANS.find((plan) => plan.name === 'Pro')!.pagesPerPdf
    const isFreeExceeded =
      pagesAmt >
      PLANS.find((plan) => plan.name === 'Free')!.pagesPerPdf

    if (
      (isSubscribed && isProExceeded) ||
      (!isSubscribed && isFreeExceeded)
    ) {
      await db.file.update({
        data: {
          uploadStatus: 'FAILED',
          processingError:
            'This PDF has too many pages for your plan.',
        },
        where: {
          id: createdFile.id,
        },
      })
      return
    }

    await withTimeout(
      processUploadedPdf(createdFile.id, pageLevelDocs),
      PROCESSING_BUDGET_MS,
      'PDF embedding and indexing'
    )
  } catch (err) {
    const message =
      err instanceof Error ? err.message : String(err)
    console.error('[uploadthing onUploadComplete]', err)

    const hint =
      /dimension|vector|pinecone/i.test(message)
        ? pineconeDimensionSetupHint()
        : /rate|503|loading|model/i.test(message)
          ? 'Hugging Face model may be cold-starting; wait and re-upload, or try a smaller HF_EMBEDDING_MODEL.'
          : /timed out/i.test(message)
            ? message
            : message.slice(0, 400)

    await db.file.update({
      data: {
        uploadStatus: 'FAILED',
        processingError: hint,
      },
      where: {
        id: createdFile.id,
      },
    })
  }
}

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
