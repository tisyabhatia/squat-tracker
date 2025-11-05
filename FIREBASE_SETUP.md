# Firebase Setup Guide

This app uses Firebase for authentication and data storage. Follow these steps to set up Firebase for your project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "checkpoint-fitness")
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## 2. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click "Enable" toggle
   - **Google**: Click "Enable", add your project's support email
   - **Apple** (optional): Requires Apple Developer account

## 3. Create a Web App

1. In Project Overview, click the **Web** icon (</>)
2. Register app with nickname (e.g., "checkpoint-web")
3. Copy the Firebase configuration object

## 4. Set Up Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. **Important**: Add `.env` to your `.gitignore` to keep credentials safe

## 5. Configure Authorized Domains

1. In Authentication → Settings → Authorized domains
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `checkpoint-fitness.app`)

## 6. Set Up Firestore Database (Optional)

If you want cloud data storage:

1. Go to **Firestore Database** → Create database
2. Choose production mode
3. Select your preferred location
4. Create these collections:
   - `users` - user profiles
   - `workouts` - workout sessions
   - `exercises` - exercise library
   - `bodyMetrics` - body measurements

## 7. Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /workouts/{workoutId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /bodyMetrics/{metricId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Exercise library is public for reading
    match /exercises/{exerciseId} {
      allow read: if true;
      allow write: if false; // Only admins can write
    }
  }
}
```

## 8. Test Authentication

1. Run the app: `npm run dev`
2. Try signing up with email/password
3. Try Google sign-in (if enabled)
4. Check Firebase Console → Authentication to see your test user

## Troubleshooting

### "auth/network-request-failed"
- Check your internet connection
- Verify Firebase API key is correct
- Ensure authorized domains are configured

### "auth/api-key-not-valid"
- Double-check your `VITE_FIREBASE_API_KEY` in `.env`
- Make sure there are no extra spaces

### "auth/unauthorized-domain"
- Add your domain to authorized domains in Firebase Console
- For localhost, add both `localhost` and `127.0.0.1`

### Google Sign-In Not Working
- Enable Google provider in Firebase Console
- Add support email in provider settings
- Clear browser cache and try again

## Development vs Production

### Development
- Uses `.env` for configuration
- Allows localhost as authorized domain
- Firebase Emulators can be used for offline dev (optional)

### Production
- Set environment variables in your hosting platform
- Update authorized domains with production URL
- Enable Firebase App Check for additional security

## Cost Considerations

Firebase free tier (Spark Plan) includes:
- **Authentication**: Unlimited users
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Hosting**: 10GB storage, 360MB/day transfer

For most personal projects, free tier is sufficient. Upgrade to Blaze (pay-as-you-go) if needed.

## Next Steps

After setup:
1. Test sign-up/sign-in flow
2. Complete onboarding
3. Log first workout
4. Data will be persisted to Firebase

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
