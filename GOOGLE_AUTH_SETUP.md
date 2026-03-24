# Google Authentication Setup Guide

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication → Sign-in method → Google
4. Go to Project Settings → Service Accounts
5. Click "Generate new private key" and download the JSON file

## 2. Environment Variables

Add these to your `.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=service_account@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## 3. Google OAuth Client Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Application type: Web application
6. Add authorized redirect URI (if needed)
7. Note the Client ID for frontend use

## 4. Frontend Integration

Replace `YOUR_GOOGLE_CLIENT_ID` in `google-auth-test.html` with your actual OAuth Client ID.

## 5. Testing

1. Start your server: `npm run dev`
2. Open `google-auth-test.html` in your browser
3. Click "Sign in with Google"
4. Check browser console for results

## 6. API Endpoint

**POST** `/api/auth/google`

**Request Body:**
```json
{
  "idToken": "google_id_token_from_frontend"
}
```

**Response:**
```json
{
  "message": "Logged in with Google successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "token": "jwt_token"
}
```

## 7. Database Schema

The User model includes:
- `googleUid`: Google user ID (nullable)
- `isVerified`: Auto-verified for Google users
- `passwordhash`: Empty string for Google users

## 8. Flow Summary

1. User clicks Google Sign-In
2. Google returns ID token to frontend
3. Frontend sends ID token to `/api/auth/google`
4. Backend verifies token with Firebase
5. Backend finds/creates user in database
6. Backend returns JWT token
7. Frontend stores token for authenticated requests
