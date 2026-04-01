import { FileUp } from 'lucide-react'

const EmptyPdfState = () => {
  return (
    <div className='mt-16 flex flex-col items-center gap-6 px-4'>
      <div
        className='empty-pdf-stack relative flex h-40 w-48 items-end justify-center'
        aria-hidden>
        <div className='empty-pdf-sheet empty-pdf-sheet--back shadow-md' />
        <div className='empty-pdf-sheet empty-pdf-sheet--mid shadow-md' />
        <div className='empty-pdf-sheet empty-pdf-sheet--front shadow-lg'>
          <FileUp className='mx-auto mt-8 h-10 w-10 text-blue-500/90' />
        </div>
      </div>

      <div className='text-center max-w-md'>
        <h3 className='font-semibold text-xl text-zinc-900'>
          No PDFs yet
        </h3>
        <p className='mt-2 text-sm text-zinc-600'>
          Upload a document to start chatting with it. Your
          files will show up here.
        </p>
      </div>

      <p className='text-xs text-zinc-500'>
        Use the <strong>Upload PDF</strong> button above.
      </p>
    </div>
  )
}

export default EmptyPdfState
