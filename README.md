# Plexshity.io

**A home for your curiosity.** Plexshity is an AI-powered chat app for exploring questions, searching for current information, and keeping useful conversations organized.

## Preview

<p align="center">
  <a href="https://plexshity-io.vercel.app/">
    <img src="Frontend/public/Plexshity-io.png" alt="Plexshity.io logo" width="160">
  </a>
</p>

<p align="center">
  <a href="https://plexshity-io.vercel.app/">Open the live app</a>
</p>

The repository does not currently include a full-page screenshot of the home screen.

## Features

- Email registration, verification, login, and logout
- AI chat with saved conversations
- Web search for questions that need current information
- Light and dark themes
- Responsive interface

## Tech stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Redis
- **AI and search:** Google Gemini, OpenRouter, Tavily
- **Email:** Nodemailer with Gmail OAuth2 SMTP

## Requirements

- Node.js 22.12 or newer (or 20.19 or newer)
- MongoDB
- Redis
- API credentials for the AI/search features you want to use
- Gmail OAuth2 credentials for verification email delivery

## Local setup

Clone the repository, then set up the backend and frontend in separate terminals.

### 1. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

MONGO_URI=mongodb://127.0.0.1:27017/plexshity
JWT_SECRET=replace-with-a-long-random-secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

GEMINI_API_KEY=your-gemini-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
TAVILY_API_KEY=your-tavily-api-key

GOOGLE_USER=your-sending-address@gmail.com
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REFRESH_TOKEN=your-google-oauth-refresh-token
```

Start the API:

```bash
npm run dev
```

The API listens on `http://localhost:8000` by default. `npm start` runs it without the development watcher.

### 2. Frontend

In another terminal:

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

## Deploying

### Backend on Render

Create a Render Web Service using `Backend` as the root directory:

- **Build command:** `npm install`
- **Start command:** `npm start`

Configure the backend environment variables from the `Backend/.env` example above. Set `NODE_ENV=production`, `FRONTEND_URL` to your deployed frontend origin, and `BACKEND_URL` to your deployed API origin.

The current email service uses Gmail over SMTP. If the hosting platform cannot connect to Gmail SMTP, email verification will not be delivered; use an email provider/API that is reachable from your backend instead.

### Frontend on Vercel

Create a Vercel project using `Frontend` as the root directory:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `VITE_BACKEND_URL` set to the deployed backend origin (for example, `https://your-api.onrender.com`)

The Vercel rewrite configuration is in `Frontend/vercel.json` so client-side routes can load directly and refresh correctly.

## Useful commands

| Directory | Command | Description |
| --- | --- | --- |
| `Backend` | `npm run dev` | Start the API with the development watcher |
| `Backend` | `npm start` | Start the API |
| `Frontend` | `npm run dev` | Start the Vite development server |
| `Frontend` | `npm run build` | Create the production frontend build |
| `Frontend` | `npm run lint` | Run ESLint |

## Legal

- [Privacy Policy](Frontend/public/privacy.md)
- [Terms of Service](Frontend/public/terms.md)

The policy files are drafts and contain placeholders that must be completed before publication.

## Security

Never commit `.env` files, API keys, OAuth credentials, database URLs, or production secrets. Keep backend secrets on the backend; only the public API origin should be exposed through the frontend's `VITE_BACKEND_URL`.
