# AIgent Impact

Marketing landing page for **AIgent Impact** — a Generative & Answer Engine
Optimization (GEO/AEO) product that scores how visible an insurance agent is
inside AI answers (ChatGPT, Perplexity, Gemini, Claude, Copilot) and shows them
how to dominate their local market.

Built with **Next.js (App Router)** and deployed on **Vercel**. The entire site
sits behind **HTTP Basic Auth** (username + password).

## Local development

```bash
npm install
cp .env.example .env.local   # then edit the credentials
npm run dev                  # http://localhost:3000
```

The browser will prompt for the username/password set in `.env.local`.

## Password protection

Access is gated by `middleware.js` using HTTP Basic Auth. Credentials are read
from environment variables (never committed):

| Variable        | Default    | Purpose             |
| --------------- | ---------- | ------------------- |
| `SITE_USERNAME` | `admin`    | Basic Auth user     |
| `SITE_PASSWORD` | `changeme` | Basic Auth password |

Change them locally in `.env.local`, and in Vercel under
**Project → Settings → Environment Variables**.

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Vercel, **Add New → Project** and import the repo. Vercel auto-detects
   Next.js — no build settings to change.
3. Add environment variables `SITE_USERNAME` and `SITE_PASSWORD`.
4. **Deploy**. Every visitor will be prompted for the credentials.
