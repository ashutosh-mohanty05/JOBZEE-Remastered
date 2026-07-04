# JobZee — Local Setup Guide (100% Free)

This guide gets the whole project (backend + frontend + Google Sign-In + AI
Resume Scanner + AI Career Helper) running on your own machine, for free.

## What changed in this version

- All hardcoded old backend URLs (`...onrender.com`) were removed. The frontend
  now reads the backend URL from `frontend/.env` (`VITE_API_URL`), defaulting
  to `http://localhost:4000`.
- Added free **Google Sign-In** (Google Identity Services) on both Login and
  Register pages.
- **Resume Scanner** now accepts an uploaded **PDF or Word (.docx)** file
  (drag-and-drop or click to browse), in addition to pasting text. Fully
  offline — no external AI API key needed.
- **Career Helper** now lets you pick **6, 15, or 30 questions** before
  starting, with a progress bar and a "back" button.
- Redesigned, responsive UI for Login, Register, Resume Scanner, and Career
  Helper.
- Fixed a real bug in the old code: the password was being re-hashed on
  every save (not just when it changed) — this is now fixed.
- Fixed cookies so login actually works on `http://localhost` (the old code
  used `secure: true, sameSite: "None"`, which only works over HTTPS).
- **Important:** the file you uploaded had real MongoDB Atlas and Cloudinary
  credentials committed in `config.env`. Treat those as compromised —
  rotate/regenerate them in your Atlas and Cloudinary dashboards. This guide
  has you set up fresh, free credentials.

---

## Prerequisites

Install these once:

1. **Node.js** (v18 or newer) — https://nodejs.org
2. **Git** (optional, only if you want version control) — https://git-scm.com
3. **MongoDB** — pick ONE of:
   - **Option A (simplest): MongoDB Community Server locally** —
     https://www.mongodb.com/try/download/community
   - **Option B: MongoDB Atlas free cloud cluster** (no local install) —
     https://www.mongodb.com/cloud/atlas/register

A code editor like VS Code is recommended but not required.

---

## Step 1 — Unzip and install dependencies

```bash
# unzip the project, then:
cd job-seeking-site-AI-integrated/backend
npm install

cd ../frontend
npm install
```

---

## Step 2 — Set up MongoDB

### Option A — Local MongoDB (recommended for local dev)

1. Install MongoDB Community Server (link above) and make sure the
   `mongod` service is running:
   - Windows: it usually installs as a service and starts automatically.
   - Mac (Homebrew): `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
2. That's it — `backend/config/config.env` is already set to:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/jobzee
   ```

### Option B — MongoDB Atlas (free cloud database)

1. Create a free account at https://www.mongodb.com/cloud/atlas/register
2. Create a free **M0** cluster.
3. Under **Database Access**, create a database user (username + password).
4. Under **Network Access**, add your IP (or `0.0.0.0/0` for local dev only).
5. Click **Connect → Drivers**, copy the connection string, and paste it into
   `backend/config/config.env` as `MONGO_URI`, e.g.:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true
   ```

---

## Step 3 — Cloudinary (free tier — used when job seekers upload a resume image with a job application)

1. Create a free account at https://cloudinary.com
2. On your Cloudinary dashboard, copy: **Cloud Name**, **API Key**, **API Secret**.
3. Paste them into `backend/config/config.env`:
   ```
   CLOUDINARY_CLIENT_NAME=your_cloud_name
   CLOUDINARY_CLIENT_API=your_api_key
   CLOUDINARY_CLIENT_SECRET=your_api_secret
   ```
   (You can skip this step if you don't plan to test the "apply to a job"
   flow — everything else works without it.)

---

## Step 4 — Google Sign-In (free, no billing required)

1. Go to https://console.cloud.google.com/ and create a new project (or pick
   an existing one).
2. Go to **APIs & Services → OAuth consent screen**:
   - User Type: **External**
   - Fill in app name, support email, developer email → Save.
   - You can leave it in "Testing" mode for local development, or publish it.
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: anything, e.g. "JobZee Local"
   - Under **Authorized JavaScript origins**, add:
     ```
     http://localhost:5173
     ```
   - Leave "Authorized redirect URIs" empty (Google Identity Services'
     button flow doesn't need one).
   - Click **Create**. Copy the **Client ID** (ends in
     `.apps.googleusercontent.com`).
4. Paste that same Client ID into **both**:
   - `backend/config/config.env` → `GOOGLE_CLIENT_ID=...`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=...`

That's it — no API key, no billing account needed. If you skip this step,
the app still works fine with normal email/password login; the Google
button will just show a small "not configured" message instead of the
button.

---

## Step 5 — Run it

Open two terminals.

**Terminal 1 — backend:**
```bash
cd backend
npm run dev
```
You should see `Server running at port 4000` and `Connected to database.`

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
Vite will print a local URL, normally `http://localhost:5173`. Open that in
your browser.

---

## Step 6 — Try it out

- **Register/Login** — email/password, or tap the Google button (pick a
  role first on the Register page).
- **Resume Scanner** (`/resume-scanner`, must be logged in) — drag & drop a
  PDF or `.docx` resume, or switch to the "Paste Text" tab.
- **Career Helper** (`/personality-helper`, must be logged in) — pick 6, 15,
  or 30 questions, answer them, get career recommendations.

---

## Troubleshooting

- **"User Not Authorized" / login doesn't stick**: make sure both apps are
  running on `localhost` (not `127.0.0.1` for one and `localhost` for the
  other — cookies are host-specific). Also make sure
  `backend/config/config.env` has `FRONTEND_URL=http://localhost:5173`.
- **CORS errors in the browser console**: double-check `FRONTEND_URL` in
  `backend/config/config.env` exactly matches the URL Vite printed.
- **MongoDB connection errors**: confirm `mongod` is running (Option A) or
  that your Atlas IP allow-list includes your current IP (Option B).
- **Google button doesn't appear**: confirm `VITE_GOOGLE_CLIENT_ID` is set in
  `frontend/.env` and that you restarted `npm run dev` after editing it (Vite
  only reads `.env` files at startup).
- **"Legacy .doc files aren't supported" error**: convert the file to `.docx`
  or `.pdf` and re-upload — old binary `.doc` format isn't reliably parseable
  without extra tooling.

---

## Deploying later (optional)

When you're ready to go live again, you'll just need to:
1. Set `frontend/.env` → `VITE_API_URL` to your deployed backend URL, and add
   your live frontend domain to Google Cloud Console's "Authorized JavaScript
   origins".
2. Set `backend/config/config.env` → `FRONTEND_URL` to your deployed frontend
   URL, and `NODE_ENV=production` (this switches cookies back to
   `secure + SameSite=None` for cross-site HTTPS cookies).
3. Use a real MongoDB Atlas cluster and real Cloudinary/Google credentials
   (not the local placeholders).
