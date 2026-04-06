import Link from 'next/link'
import Image from 'next/image'
import { Stars } from '@/components/ui/stars'
import { Footer } from '@/components/ui/footer'
import { HeroSection } from '@/components/HeroSection'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      {/* Hero + Tech (fused) */}
      <HeroSection />

      {/* Steps */}
      <div className='mx-auto mb-32 mt-32 max-w-5xl sm:mt-56 px-6 lg:px-8'>
        <div className='mb-12'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
              Start chatting in minutes
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Chatting to your PDF files has never been easier than with PDFSnap.
            </p>
          </div>
        </div>

        <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-violet-200 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-violet-600'>Step 1</span>
              <span className='text-xl font-semibold'>Sign up for an account</span>
              <span className='mt-2 text-zinc-600'>
                Start for free or choose our{' '}
                <Link href='/pricing' className='text-violet-700 underline underline-offset-2'>
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-violet-200 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-violet-600'>Step 2</span>
              <span className='text-xl font-semibold'>Upload your PDF file</span>
              <span className='mt-2 text-zinc-600'>
                We&apos;ll process your file and make it ready for you to chat with.
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-violet-200 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-violet-600'>Step 3</span>
              <span className='text-xl font-semibold'>Start asking questions</span>
              <span className='mt-2 text-zinc-600'>
                That&apos;s it. Try PDFSnap today — it takes less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className='mx-auto max-w-6xl'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <Image
                src='/file-upload-preview.jpg'
                alt='uploading preview'
                width={1419}
                height={732}
                quality={100}
                className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className='mx-auto mb-32 max-w-5xl px-6 lg:px-8'>
        <div className='mb-12'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
              What our users say
            </h2>
          </div>
        </div>

        <div className='grid border border-violet-100 rounded-xl shadow-sm md:grid-cols-2 bg-violet-50/60'>
          <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-b border-violet-100 rounded-t-xl md:rounded-t-none md:rounded-ss-xl md:border-e'>
            <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8'>
              <div className='flex justify-center'><Stars /></div>
              <p className='my-4'>PDFSnap is a game-changer for students. It swiftly extracts relevant details, making finding answers easier — a personal assistant for academics!</p>
            </blockquote>
            <figcaption className='flex items-center justify-center'>
              <img className='rounded-full w-9 h-9' src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png' alt='Bonnie Green' />
              <div className='space-y-0.5 font-medium text-left ms-3'>
                <div>Bonnie Green</div>
                <div className='text-sm text-gray-500'>IT Student</div>
              </div>
            </figcaption>
          </figure>

          <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-b border-violet-100 md:rounded-se-xl'>
            <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8'>
              <div className='flex justify-center'><Stars /></div>
              <p className='my-4'>PDFSnap boosts our support efficiency. Instantly retrieving info from manuals helps provide precise and quick responses — an invaluable tool for our team!</p>
            </blockquote>
            <figcaption className='flex items-center justify-center'>
              <img className='rounded-full w-9 h-9' src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png' alt='Roberta Casas' />
              <div className='space-y-0.5 font-medium text-left ms-3'>
                <div>Roberta Casas</div>
                <div className='text-sm text-gray-500'>Lead Designer at Dropbox</div>
              </div>
            </figcaption>
          </figure>

          <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-violet-100 md:rounded-es-xl md:border-e md:border-b-0'>
            <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8'>
              <div className='flex justify-center'><Stars /></div>
              <p className='my-4'>PDFSnap simplifies legal documents. It swiftly extracts crucial information, becoming indispensable for accessing case-relevant details.</p>
            </blockquote>
            <figcaption className='flex items-center justify-center'>
              <img className='rounded-full w-9 h-9' src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png' alt='Jese Leos' />
              <div className='space-y-0.5 font-medium text-left ms-3'>
                <div>Jese Leos</div>
                <div className='text-sm text-gray-500'>Software Engineer</div>
              </div>
            </figcaption>
          </figure>

          <figure className='flex flex-col items-center justify-center p-8 text-center bg-white rounded-b-xl md:rounded-br-xl'>
            <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8'>
              <div className='flex justify-center'><Stars /></div>
              <p className='my-4'>PDFSnap revolutionized my research! Extracting key info and answering questions is a breeze, saving me valuable time every day.</p>
            </blockquote>
            <figcaption className='flex items-center justify-center'>
              <img className='rounded-full w-9 h-9' src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png' alt='Joseph McFall' />
              <div className='space-y-0.5 font-medium text-left ms-3'>
                <div>Joseph McFall</div>
                <div className='text-sm text-gray-500'>Data Analyst</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>

      <Footer />
    </>
  )
}
