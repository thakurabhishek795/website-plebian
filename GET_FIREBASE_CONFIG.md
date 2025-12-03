# How to Get Your Firebase Web Configuration

## Quick Steps

### 1. Go to Firebase Console
Visit: **https://console.firebase.google.com**

### 2. Select Your Project
Click on your project name (or create a new project if you haven't already)

### 3. Add a Web App (if not already added)
1. Click the **⚙️ gear icon** next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If you see a web app already, skip to step 4
5. If not, click **"Add app"** button
6. Select the **Web** icon (`</>`)
7. Enter a nickname: `Plebian Collective Website`
8. ✅ Check "Also set up Firebase Hosting" (optional)
9. Click **"Register app"**

### 4. Copy Your Configuration
You'll see something like this:

```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 5. Update Your firebase-config.js
1. Open `js/firebase-config.js` in your project
2. Replace the placeholder values with your actual config
3. Save the file

---

## What Each Field Means

| Field | Description | Example |
|-------|-------------|---------|
| **apiKey** | Public API key for Firebase services | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| **authDomain** | Domain for Firebase Authentication | `your-project.firebaseapp.com` |
| **projectId** | Your Firebase project ID | `your-project-id` |
| **storageBucket** | Cloud Storage bucket | `your-project-id.appspot.com` |
| **messagingSenderId** | For Firebase Cloud Messaging | `123456789012` |
| **appId** | Unique identifier for your app | `1:123456789012:web:abcdef123456` |
| **measurementId** | For Google Analytics (optional) | `G-XXXXXXXXXX` |

---

## Security Notes

### ✅ Safe to Expose
- The **apiKey** is safe to include in your client-side code
- It's meant to be public and identifies your Firebase project
- Security is enforced through Firebase Security Rules, not by hiding the API key

### 🔒 Keep Private
- **Never commit** sensitive data to public repositories
- Use **Firebase Security Rules** to protect your database
- Set up **App Check** for additional security (optional)

---

## Common Questions

### Q: Is it safe to put the API key in my HTML/JavaScript?
**A:** Yes! The Firebase API key is designed to be public. Security is managed through:
- Firebase Authentication (who can access)
- Security Rules (what they can access)
- App Check (prevent abuse)

### Q: Do I need OAuth Client ID/Secret?
**A:** No, not for basic Firebase web apps. You only need the Firebase config shown above.

### Q: What if I can't find my config?
**A:** Go to Project Settings → Scroll to "Your apps" → Click on your web app → Scroll to "SDK setup and configuration" → Select "Config"

---

## Next Steps After Getting Config

1. ✅ Update `js/firebase-config.js` with your actual config
2. ✅ Enable Authentication in Firebase Console
3. ✅ Create your first admin user
4. ✅ Set up Firestore Security Rules
5. ✅ Test your admin dashboard

---

## Need Help?

If you're stuck:
1. Check the browser console for errors
2. Verify all fields are copied correctly (no extra spaces)
3. Make sure Authentication is enabled in Firebase Console
4. Review `FIREBASE_SETUP_INTERACTIVE.md` for detailed setup

---

**Created**: December 3, 2025
**For**: Plebian Collective Website
