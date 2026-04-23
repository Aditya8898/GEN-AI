# Firebase Integration Guide

## Problem Explained

The error **"Failed to resolve import '../../lib/firebase' from useAuth.js"** occurred due to multiple issues:

### Root Causes

1. **Circular Import in auth.api.js**
   - `auth.api.js` was importing from itself: `import api from './auth.api'`
   - This caused module resolution to fail

2. **Firebase Config with Placeholder Values**
   - firebase.js had placeholder API keys that may have prevented proper initialization
   - Firebase requires valid config to initialize properly

3. **Incorrect Import Path in useAuth.js**
   - Was trying to get `auth` from context instead of importing directly from firebase.js
   - Context was providing `auth`, but auth.context.jsx imported it from firebase.js anyway (redundant)

4. **Dependency Issues**
   - Missing proper axios instance in auth.api.js
   - Cookies not being sent because of CORS/credential configuration

## Solutions Applied

### 1. Fixed firebase.js
- Now uses environment variables instead of placeholder strings
- Properly exports both `auth` and `googleProvider`
- Works with Vite's `import.meta.env` for environment variables

```javascript
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### 2. Fixed auth.api.js (Removed Circular Import)
- Created axios instance directly in the file
- Set `withCredentials: true` to send cookies
- Removed self-import that caused the error

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true // Allows cookies to work
});
```

### 3. Fixed useAuth.js Imports
- Now directly imports `auth` and `googleProvider` from `../../lib/firebase`
- Removed importing `auth` from context
- Clean separation of concerns

```javascript
import { auth, googleProvider } from '../../lib/firebase';
import { googleSync, logout } from "../services/auth.api";
```

### 4. Fixed auth.context.jsx
- Removed redundant Firebase import
- Only imports what it needs: `getMe` function
- Context only manages user state, not Firebase auth

## Setup Instructions

### Step 1: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings (⚙️ gear icon)
4. Under "Your apps" section, select the web app
5. Copy all the config values

### Step 2: Configure Environment Variables
Edit `.env.local` in `frontend/frontend/` directory:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Enable Google Sign-In in Firebase
1. Go to Firebase Console
2. In left sidebar: Authentication → Sign-in method
3. Click "Google"
4. Enable it and click Save
5. Add your domain under "Authorized domains"

### Step 4: Backend Setup (Google Login Endpoint)
Your backend needs to handle Google login. Add this endpoint:

```javascript
// backend/src/routes/auth.routes.js
authRouter.post('/google-login', async (req, res) => {
  const { idToken } = req.body;
  
  try {
    // Verify Firebase token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    
    // Find or create user in DB
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        email,
        username: name || email.split('@')[0],
        firebaseId: uid
        // Don't store password for OAuth users
      });
    }
    
    // Create JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      user: { id: user._id, email: user.email, name: user.username }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', details: err.message });
  }
});
```

## CORS & Credentials Setup

### Frontend (Already Fixed)
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true  // ✅ CRITICAL: Allows cookies
});
```

### Backend (Check Your Express Setup)
```javascript
// backend/src/app.js
const cors = require('cors');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Allow localhost with any port
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true  // ✅ CRITICAL: Allows credentials/cookies
}));

app.use(express.json());
app.use(cookieParser());
```

## Testing the Flow

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**
   ```bash
   cd frontend/frontend
   npm run dev
   ```

3. **Test Google Login**
   - Visit http://localhost:5173 (or your port)
   - Click Google login button
   - Firebase popup appears → Select account
   - Redirects back with user logged in
   - Check DevTools > Application > Cookies for `token` cookie

## Debugging Tips

### If cookies aren't being sent:
1. Check DevTools → Network → check "Cookies" request headers
2. Verify `withCredentials: true` in axios
3. Verify backend sends `Set-Cookie` header
4. Check CORS allows credentials

### If Firebase popup doesn't appear:
1. Check browser console for Firebase errors
2. Verify `.env.local` has correct values
3. Verify Google OAuth is enabled in Firebase Console
4. Check authorized domains in Firebase

### If backend returns 401:
1. Check that idToken is being sent
2. Verify Firebase Admin SDK is initialized
3. Check that Firebase token verification works
4. Verify user creation in database

## File Structure

```
frontend/
├── .env.local (NEW - add your Firebase config here)
├── src/
│   ├── lib/
│   │   └── firebase.js (FIXED - proper exports)
│   └── features/
│       └── auth/
│           ├── auth.context.jsx (FIXED - removed auth prop)
│           ├── services/
│           │   └── auth.api.js (FIXED - removed circular import)
│           └── hooks/
│               └── useAuth.js (FIXED - direct imports)
```

## Summary of Changes

| File | Issue | Fix |
|------|-------|-----|
| firebase.js | Placeholder config | Use env variables with `import.meta.env` |
| auth.api.js | Circular import `import api from './auth.api'` | Create axios instance directly in file |
| useAuth.js | Import auth from context | Import auth directly from firebase.js |
| auth.context.jsx | Providing auth in context | Remove auth, only manage user state |

## Key Takeaways

✅ **Direct imports are better than passing through context** - Firebase auth is a library, not app state
✅ **Always use `withCredentials: true`** - Otherwise cookies won't work
✅ **Environment variables protect secrets** - Never commit Firebase keys
✅ **Separate concerns** - Auth context for user state, firebase.js for Firebase SDK

