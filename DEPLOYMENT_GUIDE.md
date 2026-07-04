# Deploying JobZee to Production — 100% Free

This uses only free tiers: **MongoDB Atlas** (database), **Render** (backend
API), **Vercel** (frontend), **Cloudinary** (free file storage), and
**Google Cloud Console** (free OAuth). No credit card is required for any of
these at this scale.

> Two small bugs were also fixed while preparing this: a CORS options typo
> (`method` → `methods`) that silently did nothing, and a hardcoded `/tmp/`
> temp-file path for uploads that only works on Linux — both fixed in
> `backend/app.js` so uploads work the same locally (Windows) and in
> production (Render, which is Linux).

---

## Overview of what you're setting up

```
Browser  ──HTTPS──>  Vercel (frontend, static React build)
                            │
                            │ HTTPS API calls
                            ▼
                     Render (backend, Node/Express)
                            │
                            ▼
                MongoDB Atlas (database)   Cloudinary (resume images)
```

---

## Step 0 — Push your code to GitHub

Render and Vercel both deploy by connecting to a GitHub repo.

1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new empty repository (don't initialize with a README).
3. From your project folder:
   ```bash
   cd job-seeking-site-AI-integrated-updated
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

Your `.gitignore` files already exclude `node_modules`, `.env`, and
`config.env`, so your real secrets won't be pushed — good. You'll re-enter
them directly into Render/Vercel's dashboards in the steps below.

---

## Step 1 — MongoDB Atlas (free forever, M0 tier)

If you already made an Atlas cluster while testing locally, you can reuse it
— just do sub-step 3 below.

1. https://www.mongodb.com/cloud/atlas/register → create a free account.
2. Create a free **M0** cluster (pick any region close to you).
3. **Network Access** → **Add IP Address** → choose **Allow Access from
   Anywhere** (`0.0.0.0/0`). This is required because Render's free tier
   doesn't have a fixed IP.
4. **Database Access** → create a database user (username + password —
   avoid special characters like `@` or `/` in the password, or URL-encode
   them).
5. **Connect → Drivers** → copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jobzee?retryWrites=true&w=majority
   ```
   Keep this handy for Step 3.

---

## Step 2 — Cloudinary (free tier)

(Skip if you already set this up locally — same credentials work in
production.)

1. https://cloudinary.com → free account.
2. Dashboard → copy **Cloud Name**, **API Key**, **API Secret**.

---

## Step 3 — Deploy the backend to Render (free tier)

1. https://render.com → sign up (you can sign up with GitHub directly).
2. **New +** → **Web Service** → connect your GitHub repo.
3. Configure:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Under **Environment Variables**, add each of these (values from your own
   `config.env`, updated as noted):

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your Atlas connection string from Step 1 |
   | `FRONTEND_URL` | *(leave blank for now — you'll fill this in after Step 4)* |
   | `JWT_SECRET_KEY` | any long random string |
   | `JWT_EXPIRES` | `5d` |
   | `COOKIE_EXPIRE` | `5` |
   | `GOOGLE_CLIENT_ID` | your Google OAuth client ID |
   | `CLOUDINARY_CLIENT_NAME` | from Step 2 |
   | `CLOUDINARY_CLIENT_API` | from Step 2 |
   | `CLOUDINARY_CLIENT_SECRET` | from Step 2 |

   Don't add `PORT` — Render sets that automatically and the app already
   reads `process.env.PORT`.

5. Click **Create Web Service**. Wait for the build/deploy to finish, then
   copy your live backend URL, e.g. `https://jobzee-backend.onrender.com`.

> **Free tier note:** Render's free web services "spin down" after ~15
> minutes of no traffic, and the next request takes 30–50 seconds to wake it
> back up. This is normal on the free tier — fine for a portfolio/demo
> project, not ideal for real users. There's no free way around this on
> Render specifically; upgrading to a paid instance removes it.

---

## Step 4 — Deploy the frontend to Vercel (free tier)

1. https://vercel.com → sign up with GitHub.
2. **Add New → Project** → import your same GitHub repo.
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | your Render backend URL from Step 3 (no trailing slash) |
   | `VITE_GOOGLE_CLIENT_ID` | your Google OAuth client ID |

5. Click **Deploy**. Once done, copy your live frontend URL, e.g.
   `https://jobzee.vercel.app`.

---

## Step 5 — Wire the two together

1. Back in **Render** → your backend service → **Environment** → set
   `FRONTEND_URL` to your Vercel URL from Step 4 (e.g.
   `https://jobzee.vercel.app`, no trailing slash) → Save (this redeploys
   the backend automatically).
2. In **Google Cloud Console** → **APIs & Services → Credentials** → your
   OAuth Client ID → **Authorized JavaScript origins** → add your Vercel URL:
   ```
   https://jobzee.vercel.app
   ```
   (Keep your `http://localhost:5173` entry too, so local dev keeps working.)
   Save.

---

## Step 6 — Test it

Visit your Vercel URL and test:
- Register / Login (email + Google)
- Post a job / browse jobs
- Resume Scanner (upload a PDF/Word file)
- Career Helper quiz

If the very first request feels slow (~30–50s), that's Render's free tier
waking up — expected, described in Step 3's note.

---

## Troubleshooting

- **CORS error in browser console**: `FRONTEND_URL` on Render must exactly
  match your Vercel URL (protocol + domain, no trailing slash).
- **Login doesn't persist / cookie not set**: confirm `NODE_ENV=production`
  is set on Render — this is what switches cookies to
  `Secure; SameSite=None`, required for cross-domain cookies over HTTPS.
- **Google Sign-In: `origin_mismatch`**: the Authorized JavaScript origin in
  Google Cloud Console must exactly match your Vercel domain, including
  `https://` and no trailing slash. Changes can take a minute or two to
  apply.
- **Database connection errors on Render**: double check Atlas → Network
  Access includes `0.0.0.0/0`, and the password in `MONGO_URI` doesn't have
  unescaped special characters.
- **Resume upload fails in production but works locally**: this was the
  `/tmp/` bug mentioned at the top — make sure you're deploying the updated
  `backend/app.js` (already fixed in this version).

---

## Costs at this scale

Everything above (Atlas M0, Render free web service, Vercel Hobby plan,
Cloudinary free tier, Google OAuth) has **no cost** and no credit card
requirement, as long as you stay within each provider's free-tier limits —
which a personal/portfolio-scale project comfortably does.
