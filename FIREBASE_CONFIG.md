# Firebase Configuration for Cloudflare Pages

## Issue: Google Login Not Working

The Google authentication is failing because the Cloudflare Pages domain is not authorized in Firebase.

## Fix Required:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select Project**: upskillbro-app
3. **Go to Authentication > Settings > Authorized Domains**
4. **Add these domains**:
   - `upskillbr0-2-0.pages.dev`
   - `*.pages.dev` (for all Cloudflare Pages subdomains)
   - `localhost` (for local development)

## Current Authorized Domains Should Include:
- `localhost`
- `upskillbro-app.firebaseapp.com`
- `upskillbr0-2-0.pages.dev` ← **ADD THIS**

## Alternative Solution:
If you can't access Firebase Console, update the environment.ts with a new Firebase project that has the correct domain authorization.

## Test After Fix:
1. Visit: https://upskillbr0-2-0.pages.dev/login
2. Click "Continue with Google"
3. Should open Google OAuth popup
4. After login, should redirect to dashboard

## Error Codes:
- `auth/unauthorized-domain` = Domain not in authorized list
- `auth/popup-blocked` = Browser blocked popup
- `auth/popup-closed-by-user` = User closed popup