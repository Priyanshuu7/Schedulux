
# 🚀 Schedulux

**Schedulux** is a blazing-fast meeting scheduling platform built with Next.js App Router and Nylas. It enables users to create event types, share booking links, and manage their availability—making it effortless for clients to book time with them.

## 📸 Demo

👉 [Live Demo](https://schedulux.vercel.app) *(replace with your live link)*

## 🔧 Features

- 🧾 **Event Types** – Define custom meetings with titles, durations, and descriptions.
- 📅 **Availability Management** – Set and update weekly availability.
- 🔗 **Shareable Booking Links** – Each event type has a unique, client-friendly URL.
- 🔐 **Auth.js Integration** – Login using Google or GitHub.
- 🔌 **Nylas API Integration** – Real-time meeting creation and calendar syncing.
- 🎥 **Auto Google Meet Links** – Meetings are created with video conferencing enabled.
- 📈 **Fully Typed & Validated** – Uses Zod and `conform-to/zod` for validation.
- 💨 **Fast & Secure** – Powered by Next.js App Router with server actions.

## 🛠️ Tech Stack

| Tech | Description |
|------|-------------|
| **Next.js 14+** | App Router, Server Actions |
| **Tailwind CSS** | Styling |
| **Auth.js** | Authentication via Google/GitHub |
| **Prisma** | ORM for PostgreSQL |
| **Nylas** | Calendar & Email API for scheduling |
| **Zod + conform-to/zod** | Form validation |
| **PostgreSQL** | Database |

## 🧑‍💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/schedulux.git
cd schedulux
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file and add:
```env
DATABASE_URL=postgresql://<your-db-url>
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000

NYLAS_CLIENT_ID=<your-nylas-client-id>
NYLAS_CLIENT_SECRET=<your-nylas-client-secret>
NYLAS_API_URL=https://api.nylas.com
```

### 4. Push Prisma schema & generate client
```bash
npx prisma db push
npx prisma generate
```

### 5. Run locally
```bash
npm run dev
```

## 🗂️ Project Structure

```
app/
  ├── actions/           // Server actions
  ├── api/               // Auth + Nylas APIs
  ├── dashboard/         // Authenticated user dashboard
  ├── onboarding/        // Onboarding flow
  ├── [username]/[slug]  // Booking page

lib/
  ├── db.ts              // Prisma Client
  ├── hooks.ts           // requireUser() logic
  ├── nylas.ts           // Nylas wrapper
  ├── zodSchemas.ts      // Zod schema definitions

components/
  ├── ui/                // shadcn/ui components
  ├── shared/            // Custom components
```

## 🌐 Deployment

This project is ready for **Vercel** deployment.

- Add environment variables in Vercel dashboard
- Set up PostgreSQL (e.g., Railway, Supabase, Neon)
- Use Vercel’s automatic CI/CD for seamless updates

## 🙋‍♂️ Author

**Priyanshu Rajak**  
Made with ❤️ for developers who hate back-and-forth scheduling.

- [Twitter](https://twitter.com/yourhandle)
- [LinkedIn](https://linkedin.com/in/yourhandle)
- [Portfolio](https://yourwebsite.com)

## 📄 License

MIT