# PDFSnap

A full‑stack SaaS that lets you chat with your PDF documents using AI. Upload a PDF, ask questions, and get answers in real time.

## How This Project Was Built

### Core Idea

PDFSnap turns PDFs into interactive documents. After upload, documents are chunked and embedded, stored in a vector database, and queried with an LLM so you can ask questions and get relevant answers.

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 13.5 (App Router) | SSR, API routes, file-based routing |
| **Language** | TypeScript | Type safety across the app |
| **API** | tRPC | Type-safe API layer and React Query integration |
| **Database** | MongoDB + Prisma | Document storage and ORM |
| **Auth** | Kinde | OAuth, login, and registration |
| **Payments** | Stripe | Subscriptions and billing |
| **File Upload** | UploadThing | PDF upload and storage |
| **AI** | OpenAI + LangChain | Embeddings and chat completion |
| **Vector Store** | Pinecone | Semantic search over document chunks |
| **Styling** | Tailwind CSS + shadcn/ui | Layout and components |

### Architecture

1. **Upload flow** – Users upload PDFs via UploadThing. Files are stored, and server-side processing:
   - Loads the PDF with LangChain
   - Splits it into chunks
   - Creates embeddings with OpenAI
   - Stores vectors in Pinecone for retrieval

2. **Chat flow** – Questions are sent to the API route. It:
   - Retrieves relevant chunks from Pinecone
   - Builds a prompt with the document context
   - Streams the LLM response back to the client

3. **Data model** – Prisma models: `User` (from Kinde), `File` (metadata and status), `Message` (chat history).

### Features

- Chat with PDFs using AI
- Free and Pro plans via Stripe
- PDF viewer with chat sidebar
- Streaming responses for low latency
- Infinite scroll for chat history
- Drag-and-drop uploads
- Responsive UI with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Accounts for: Kinde, OpenAI, Pinecone, Stripe, UploadThing

### Installation

```bash
git clone https://github.com/Aziiz01/PDF.git
cd PDF
npm install
```

### Environment Variables

Create a `.env` file with:

```
# Database
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority"

# Kinde
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGIN_REDIRECT_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=

# OpenAI
OPENAI_API_KEY=

# Pinecone
PINECONE_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

### Database Setup

```bash
npx prisma db push
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (tRPC, auth, webhooks)
│   ├── dashboard/         # Dashboard and file chat pages
│   ├── pricing/           # Pricing page
│   └── sign-in/           # Sign-in page
├── components/            # React components
├── config/                # Stripe plans, infinite query config
├── lib/                   # Shared utilities and integrations
└── trpc/                  # tRPC router and procedures
```

