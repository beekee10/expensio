# 🚀 Expensio — Production Deployment Guide

This guide walks you through deploying **Expensio** completely free using the modern cloud stack:
- **Database**: [Neon.tech](https://neon.tech) (Free Serverless PostgreSQL)
- **Backend API**: [Render.com](https://render.com) (Free FastAPI Web Service)
- **Frontend UI**: [Vercel](https://vercel.com) (Free React SPA Hosting)

---

## 📋 Overview of Deployment Flow

```
+-------------------------------------------------------+
|  1. Neon Database (PostgreSQL)                       |
|     Provides connection string with sslmode=require   |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|  2. Render Web Service (FastAPI Backend)              |
|     - Runs: uvicorn app.main:app                     |
|     - Env: DATABASE_URL, SECRET_KEY, ALLOWED_ORIGINS  |
|     - URL: https://expensio-backend.onrender.com     |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|  3. Vercel (React Frontend)                          |
|     - Root: frontend/                                 |
|     - Env: VITE_API_URL = Live Render Backend URL    |
|     - URL: https://expensio.vercel.app               |
+-------------------------------------------------------+
```

---

## 🗄️ Step 1: Set Up Cloud PostgreSQL on Neon (2 mins)

1. Go to [https://neon.tech](https://neon.tech) and sign up / sign in (free).
2. Click **Create Project**:
   - **Project Name**: `expensio-db`
   - **Region**: Choose the region closest to your users (e.g., `US East (Ohio)` or `EU (Frankfurt)`).
   - Click **Create Project**.
3. On the project dashboard, locate the **Connection Details** box.
4. Select **Connection string** > **Direct connection** (or Pooled).
5. Copy the PostgreSQL connection URI. It will look like:
   ```text
   postgresql://neondb_owner:YOUR_PASSWORD@ep-random-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   *(Keep this tab open or save the URI somewhere secure for Step 2).*

> **Note**: Expensio automatically creates all database tables (`users`, `expenses`, etc.) on initial backend boot. You do **not** need to manually run SQL tables scripts.

---

## ⚙️ Step 2: Push Code to GitHub

Make sure all your latest changes and deployment files are committed and pushed to GitHub:

```powershell
git add .
git commit -m "Configure production deployment for Vercel, Render, and Neon"
git push origin main
```

---

## 🐍 Step 3: Deploy Backend on Render (3 mins)

1. Go to [https://render.com](https://render.com) and log in.
2. In the top right, click **New +** > **Web Service**.
3. Select **Build and deploy from a Git repository** > Click **Next**.
4. Connect your GitHub account and select your repository (`expensio`).
5. Configure the service settings:
   - **Name**: `expensio-backend` *(or a name of your choice)*
   - **Region**: Same or close to your Neon database region
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: Select **Free**.

6. Scroll down to **Environment Variables** and add the following:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | *Paste your Neon PostgreSQL URI from Step 1* | Primary database |
   | `SECRET_KEY` | *Enter a random 32+ character string* | For JWT auth encryption |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | 24-hour token expiration |
   | `ALLOWED_ORIGINS` | `http://localhost:5173,https://*.vercel.app` | Whitelist frontend origins |
   | `PYTHON_VERSION` | `3.11.9` | Reliable Python version |

7. Click **Create Web Service**.
8. Wait 1-2 minutes for the build to finish. Once you see **"Application startup complete"**, copy your backend URL at the top:
   ```text
   https://expensio-backend.onrender.com
   ```
9. **Verify Health**: Visit `https://expensio-backend.onrender.com/docs` in your browser. You should see the interactive Swagger UI!

---

## ⚡ Step 4: Deploy Frontend on Vercel (2 mins)

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Select your repository (`expensio`) and click **Import**.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` *(Vercel usually auto-detects this)*
   - **Root Directory**: Click **Edit** and select `frontend`
   - **Build and Output Settings**: Leave defaults (`npm run build`, output: `dist`)
5. Open the **Environment Variables** accordion and add:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://expensio-backend.onrender.com` *(Your Render backend URL from Step 3, without a trailing slash)* |

6. Click **Deploy**.
7. In ~30 seconds, Vercel will complete the build and give you a live production URL:
   ```text
   https://expensio-xyz.vercel.app
   ```

---

## 🔄 Step 5: (Optional) Fine-Tune Backend CORS

Now that your specific Vercel URL is known (e.g. `https://expensio.vercel.app`):
1. Go back to **Render Dashboard** > `expensio-backend` > **Environment**.
2. Update `ALLOWED_ORIGINS` to include your exact frontend URL:
   ```text
   http://localhost:5173,https://expensio.vercel.app
   ```
   *(Note: The backend is already configured with `allow_origin_regex=r"https://.*\.vercel\.app"`, so all Vercel preview and production branches work automatically!)*
3. Click **Save Changes** (Render will automatically re-deploy in seconds).

---

## 🧪 Verification & Smoke Testing Checklist

1. **Backend Health Check**:
   - Open `https://<your-render-app>.onrender.com/health` -> should return `{"status":"healthy"}`.
   - Open `https://<your-render-app>.onrender.com/docs` -> Swagger UI loads properly.
2. **User Registration & Login**:
   - Visit your Vercel frontend.
   - Click **Get Started** / **Sign In**, create a new account.
   - Verify that you are logged in and your name displays in the navbar.
3. **Expense Management**:
   - Add a new transaction (e.g., "Grocery Shopping", $75.00, "Food & Dining").
   - Confirm the transaction card and category progress bars update immediately.
4. **Data Persistence**:
   - Refresh the page or log out and log back in -> verify all data persists securely in Neon PostgreSQL.

---

## 💡 Important Free-Tier Tips

1. **Render Free Tier Spin-Down**:
   - Free Web Services on Render sleep after 15 minutes of inactivity.
   - The first request after sleeping may take 30–50 seconds to wake up ("cold start"). Subsequent requests are fast.
   - *Free Keep-Alive Tip*: You can set up a free monitor on [UptimeRobot](https://uptimerobot.com) or [Cron-Job.org](https://cron-job.org) to ping `https://<your-render-app>.onrender.com/health` every 10 minutes to keep it awake!
2. **Neon Database SSL Requirement**:
   - Neon requires `sslmode=require`. This is already handled in `backend/app/database.py` and the connection string.
