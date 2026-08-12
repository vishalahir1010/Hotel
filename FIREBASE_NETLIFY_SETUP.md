# Firebase on Netlify - Setup Guide

## Problem
The Firebase "auth/invalid-api-key" error occurs on Netlify production because environment variables are not being passed to the Vite build process.

## Why This Happens
- Your `.env` file is in `.gitignore` (correct for security)
- GitHub doesn't receive `.env`, so Netlify can't access it
- Without env vars, Vite builds an app with `undefined` Firebase config values
- Firebase then fails with "invalid-api-key" error

## Solution: Configure Environment Variables in Netlify

### Step 1: Get Your Firebase Credentials
1. Open your `.env` file locally (at the root of your project)
2. Copy the 6 Firebase values:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Step 2: Set Environment Variables in Netlify Dashboard
1. Go to your Netlify Site: https://app.netlify.com/teams/[your-team]/sites/[your-site]
2. Click **Site Settings** (top navigation)
3. In left sidebar, click **Build & Deploy**
4. Click **Environment**
5. Click **Add a variable** for each Firebase variable above
   - **Variable Name**: `VITE_FIREBASE_API_KEY` (exactly as shown)
   - **Value**: Copy from your local `.env` file
6. Repeat for all 6 variables

### Step 3: Trigger a Rebuild
1. After adding all variables, go to **Deploys** tab
2. Click **Trigger Deploy** > **Deploy Site**
3. Watch the build log to confirm the build succeeds

### Step 4: Verify Firebase Works
1. Visit your Netlify site URL
2. Test Firebase authentication:
   - Try signing up with email/password
   - Try signing in
   - Try signing out
3. Check browser console (F12) for any Firebase errors

## Validation
A validation check was added to `src/firebase.js` that will throw an error if any Firebase env var is missing. This helps identify configuration issues immediately.

## Local Development
No changes needed for local development:
- Your `.env` file contains the values
- `npm run dev` works as before
- `npm run build` works as before (builds with your local .env)

## Security Best Practices
✅ Do NOT commit `.env` to GitHub  
✅ Do NOT hardcode Firebase credentials in code  
✅ Use Netlify environment variables for production  
✅ Use local `.env` for development  
✅ Rotate your Firebase API key if ever exposed  

## Troubleshooting
- **Build fails**: Check Netlify build log for error message
- **Firebase still fails**: Ensure all 6 variables are set in Netlify (check spelling!)
- **Values look correct**: Clear browser cache and hard refresh (Ctrl+Shift+R)
- **Still not working**: Check Netlify build output - Firebase config should be visible in bundle

## References
- Vite env vars: https://vite.dev/guide/env-and-modes
- Firebase setup: https://firebase.google.com/docs/web/setup
- Netlify env vars: https://docs.netlify.com/configure-builds/environment-variables/
