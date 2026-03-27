# Portfolio Website - Render Deployment Guide

## Changes Made for Render + PostgreSQL

### 1. **Dependencies Updated** (`package.json`)
- Replaced `mongoose` with `pg` (PostgreSQL client)
- Added `dotenv` for environment variable management
- Updated main entry point from `firebase-config.js` to `server.js`
- Added `start` script: `"start": "node server.js"`
- Added Node.js engine specification (v18.x)

### 2. **Backend Refactored** (`server.js`)
- Migrated from MongoDB to PostgreSQL
- Implemented automatic table creation on startup
- Port is now environment-variable configurable (defaults to 5000)
- Added health check endpoint (`/api/health`)
- Added proper error handling and graceful shutdown
- Configured SSL for production (required by Render)
- Added input validation

### 3. **Frontend Updated** (`frontend/script.js`)
- Changed hardcoded `http://localhost:5000` to dynamic URL detection
- Now works on any domain (localhost, Render URL, custom domain)
- Updated success message (no longer mentions MongoDB)

### 4. **Configuration Files**
- `.env.example` - Template for environment variables
- `.gitignore` - Prevents committing node_modules and .env files
- `render.yaml` - Render deployment configuration

---

## Deployment Steps

### Step 1: Prepare Your GitHub Repository

1. Make sure your portfolio is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment with PostgreSQL"
   git push origin main
   ```

2. Ensure `.gitignore` is working (don't commit `node_modules` or `.env`)

---

### Step 2: Set Up on Render

1. Go to [render.com](https://render.com) and sign in with your GitHub account
2. Click **"+ New"** → **"Web Service"**
3. Select your portfolio repository
4. Fill in the deployment settings:
   - **Name**: `portfolio-backend` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (you can upgrade later)

---

### Step 3: Create PostgreSQL Database on Render

1. From Render dashboard, click **"+ New"** → **"PostgreSQL"**
2. Fill in:
   - **Name**: `portfolio-db` (or your preferred name)
   - **Database**: `portfolio` (or your preferred name)
   - **User**: `portfolio_user` (or your preferred name)
   - **Region**: Choose one close to you
   - **Plan**: Free
3. Click **"Create Database"**
4. Wait for the database to be created (2-3 minutes)
5. Copy the **Internal Database URL** (you'll need this next)

---

### Step 4: Connect Database to Backend Service

1. Go back to your backend service on Render
2. Click **"Environment"** in the left sidebar
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL from your PostgreSQL service
   - **Key**: `NODE_ENV`
   - **Value**: `production`
5. Click **"Save Changes"**
6. The service will automatically redeploy

---

### Step 5: Verify Deployment

1. Go to your service's URL and check the logs
2. You should see:
   ```
   ✓ Database table initialized successfully
   ✓ Connected to PostgreSQL
   🚀 Backend server is running on port XXXX
   ```
3. Visit `https://your-service-name.onrender.com/api/health`
   - Should return: `{"status":"OK","uptime":...}`

---

### Step 6: Update Frontend for Production

1. Update your frontend's API calls if needed
   - Current code: `${window.location.protocol}//${window.location.host}/api/contact`
   - This automatically uses the correct domain ✓

2. If you're hosting frontend separately:
   - Update API URL to your Render backend URL
   - Example: `https://portfolio-backend.onrender.com/api/contact`

---

## Local Development Setup

To run locally with PostgreSQL:

1. **Install PostgreSQL** locally or use Docker
2. **Create a local database**:
   ```sql
   CREATE DATABASE portfolio;
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   ALTER ROLE portfolio_user SET client_encoding TO 'utf8';
   ALTER ROLE portfolio_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE portfolio_user SET default_transaction_deferrable TO on;
   ALTER ROLE portfolio_user SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```
   DATABASE_URL=postgresql://portfolio_user:your_password@localhost:5432/portfolio
   NODE_ENV=development
   PORT=5000
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

---

## Troubleshooting

### "Cannot connect to database"
- Check that DATABASE_URL environment variable is set correctly
- Verify the PostgreSQL service is running on Render
- Check the Internal Database URL format

### "Port already in use"
- Change the PORT in `.env` or let Render assign one automatically
- Kill any existing processes on port 5000: `lsof -ti:5000 | xargs kill -9`

### "CORS errors"
- Ensure frontend and backend URLs are correctly configured
- The backend already has CORS enabled for all origins

### Frontend not connecting
- Use browser DevTools (F12) → Console to check error messages
- Verify the API URL is accessible: Visit `/api/health` endpoint

---

## Next Steps

### Optional: Host Frontend on Render Too
1. Create another web service for your frontend folder
2. Set **Start Command** to: `npx serve -s -l 3000`
3. Or build a static site using a build command if using a framework

### Optional: Add Custom Domain
1. Go to your service settings
2. Add your custom domain
3. Update DNS records as instructed by Render

### Optional: Enable Auto-Deploy
- Render automatically deploys when you push to GitHub

---

## Security Notes

⚠️ **Important Security Updates Needed:**

1. **Never commit `.env` files** with real credentials
2. **Use environment variables** for all sensitive data
3. **DATABASE_URL** is securely stored in Render's environment variables
4. **Rotate credentials** regularly if you were using the old MongoDB credentials elsewhere

---

## API Endpoints

- `POST /api/contact` - Submit contact form
  - Body: `{ name, email, message }`
  - Returns: `{ success: true, message: "...", id: 123 }`

- `GET /api/health` - Health check
  - Returns: `{ status: "OK", uptime: 123.45 }`

---

## Support

If you encounter issues:
1. Check Render's logs (Dashboard → Your Service → Logs)
2. Verify environment variables are set correctly
3. Test locally first with the same DATABASE_URL format
4. Contact Render support: [render.com/support](https://render.com/support)
