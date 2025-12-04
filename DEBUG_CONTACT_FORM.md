# Debugging Contact Form

**Date**: December 3, 2025

## 🔍 The Issue
The contact form is stuck on "Sending...". This usually means the connection to the database is hanging.

## 🛠 Steps to Fix

### 1. Check Firestore Database Creation
**Crucial Step:** Have you actually created the Cloud Firestore database in the Firebase Console?
1. Go to [Firebase Console > Firestore Database](https://console.firebase.google.com/project/website-plebian/firestore).
2. If you see a button saying **"Create Database"**, you MUST click it.
3. Select **"Start in production mode"** (or test mode).
4. Choose a location (e.g., `nam5` or `asia-south1`).

If the database doesn't exist, the code will hang forever trying to find it.

### 2. Check Security Rules
If the database exists, check the Rules tab.
Ensure you have this rule to allow public submissions:

```javascript
match /contact_submissions/{submissionId} {
  allow create: if true;
}
```

### 3. Check Console Logs
I have added debug logs to the code.
1. Open your website (`http://localhost:8000/Main.html`).
2. Open Developer Tools (**F12** or **Right Click > Inspect > Console**).
3. Try sending a message.
4. Look for:
   - `Attempting to add document...`
   - Any red error messages.

## 🚀 Recommended Solution: Deploy
Running on `localhost` often has issues. Deploying to Firebase Hosting is the most robust fix.

**Command to Deploy:**
(I can run this for you if you want)
```bash
firebase login
firebase init hosting
firebase deploy
```
