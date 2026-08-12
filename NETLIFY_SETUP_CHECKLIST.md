# Netlify Firebase Configuration - Quick Checklist

## ✅ Code is Ready
- [x] firebase.js has environment variable validation
- [x] netlify.toml is configured with build command
- [x] _redirects file handles SPA routing
- [x] .env is protected in .gitignore (NOT committed)

## ⚠️ What YOU Need to Do in Netlify Dashboard

### 1. Open Netlify Site Settings
- Go to: https://app.netlify.com/
- Find your "Hotel" site
- Click **Site Settings** (top menu bar)

### 2. Configure Environment Variables
- Left sidebar: **Build & Deploy** → **Environment**
- Add 6 variables (click "Add a variable" for each):

| Variable Name | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | Copy from `.env` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Copy from `.env` |
| `VITE_FIREBASE_PROJECT_ID` | Copy from `.env` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Copy from `.env` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Copy from `.env` |
| `VITE_FIREBASE_APP_ID` | Copy from `.env` |

### 3. Trigger a New Deployment
- Go to **Deploys** tab (top menu bar)
- Click **Trigger Deploy** → **Deploy site**
- Wait for build to complete (should take 1-2 minutes)

### 4. Test Firebase Authentication
- Open your Netlify site URL
- Try to sign up or sign in
- Check browser console (F12) for errors
- ✅ No "auth/invalid-api-key" error = Success!

---

## 📋 Copy-Paste Instructions

1. Open Netlify dashboard: https://app.netlify.com/
2. Click your "Hotel" site
3. Click "Site Settings" 
4. Click "Build & Deploy" → "Environment"
5. For each of these 6 variables, click "Add a variable":
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
6. Paste the corresponding value from your local `.env` file
7. Save all 6 variables
8. Go to "Deploys" tab
9. Click "Trigger Deploy" → "Deploy site"
10. Wait for build to complete
11. Test your site - Firebase should work now!

---

## ❓ Need Help?
- See `FIREBASE_NETLIFY_SETUP.md` for detailed explanation
- Check Netlify build log for errors (Deploys tab → click deploy → View logs)
- Contact support if variables are set correctly but still failing
