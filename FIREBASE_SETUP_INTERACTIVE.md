# Firebase Console Setup - Interactive Guide

## 🚀 Let's Set Up Firebase Together!

Follow these steps carefully. I'll guide you through each one.

---

## Step 1: Create Your Firebase Project

### Actions:
1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the **"Add project"** button (or **"Create a project"**)
   - You'll see a wizard with 3 steps

### Step 1a: Project Name
   - **Project name:** `plebian-collective` (or your preferred name)
   - Click **"Continue"**

### Step 1b: Google Analytics (Optional)
   - Toggle: **Enable Google Analytics** (Recommended: ON)
   - Click **"Continue"**

### Step 1c: Analytics Account
   - Select: **"Default Account for Firebase"** (or create new)
   - Accept the terms
   - Click **"Create project"**

### Wait Time: ~30 seconds
   - Firebase will create your project
   - Click **"Continue"** when ready

---

## Step 2: Register Your Web App

### Actions:
1. **Add Web App**
   - On the project overview page, click the **Web icon** (`</>`)
   - It's in the center area that says "Get started by adding Firebase to your app"

2. **Register App**
   - **App nickname:** `Plebian Collective Website`
   - ✅ Check: **"Also set up Firebase Hosting"** (Optional but recommended)
   - Click **"Register app"**

3. **Copy Firebase Configuration** ⚠️ IMPORTANT!
   - You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "plebian-collective.firebaseapp.com",
  projectId: "plebian-collective",
  storageBucket: "plebian-collective.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

   - **COPY THIS ENTIRE OBJECT** - You'll need it in Step 7!
   - Click **"Continue to console"**

---

## Step 3: Enable Firestore Database

### Actions:
1. **Navigate to Firestore**
   - In the left sidebar, click **"Build"** → **"Firestore Database"**
   - Click **"Create database"**

2. **Choose Mode**
   - Select: **"Start in test mode"** (for development)
   - ⚠️ Note: We'll secure this later with proper rules
   - Click **"Next"**

3. **Choose Location**
   - Select: **"asia-south1 (Mumbai)"** (for India)
   - Or choose the closest location to your users
   - Click **"Enable"**

### Wait Time: ~1 minute
   - Firestore is being provisioned
   - You'll see the Firestore console when ready

---

## Step 4: Set Up Firestore Security Rules

### Actions:
1. **Go to Rules Tab**
   - In Firestore Database, click the **"Rules"** tab at the top

2. **Replace Default Rules**
   - Delete everything in the editor
   - Copy and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact form submissions - anyone can write, only admins can read
    match /contact_submissions/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Donations - anyone can write, only admins can read
    match /donations/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Newsletter subscribers - anyone can write, only admins can read
    match /newsletter_subscribers/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Gallery images - anyone can read, only admins can write
    match /gallery_images/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Events - anyone can read, only admins can write
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Event registrations - anyone can create, only admins can read
    match /event_registrations/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

3. **Publish Rules**
   - Click **"Publish"** button
   - Rules are now active!

---

## Step 5: Enable Authentication

### Actions:
1. **Navigate to Authentication**
   - In the left sidebar, click **"Build"** → **"Authentication"**
   - Click **"Get started"**

2. **Enable Email/Password**
   - Click on **"Email/Password"** in the Sign-in providers list
   - Toggle **"Enable"** to ON
   - Click **"Save"**

3. **Create Your First Admin User**
   - Click the **"Users"** tab at the top
   - Click **"Add user"**
   - **Email:** your-admin-email@example.com
   - **Password:** Create a strong password (save it!)
   - Click **"Add user"**

   ⚠️ **SAVE THESE CREDENTIALS!** You'll need them to login to admin.html

---

## Step 6: Enable Cloud Storage

### Actions:
1. **Navigate to Storage**
   - In the left sidebar, click **"Build"** → **"Storage"**
   - Click **"Get started"**

2. **Choose Mode**
   - Select: **"Start in test mode"**
   - Click **"Next"**

3. **Choose Location**
   - Use the same location as Firestore (asia-south1)
   - Click **"Done"**

4. **Set Storage Rules**
   - Click the **"Rules"** tab
   - Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

   - Click **"Publish"**

---

## Step 7: Update Your Website Configuration

### Actions:
1. **Open firebase-config.js**
   - In VS Code, open: `js/firebase-config.js`

2. **Replace Configuration**
   - Find the placeholder config (lines 3-10)
   - Replace with YOUR config from Step 2
   - It should look like this:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY_HERE",
    authDomain: "plebian-collective.firebaseapp.com",
    projectId: "plebian-collective",
    storageBucket: "plebian-collective.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX"
};
```

3. **Save the File**
   - Press Cmd+S (Mac) or Ctrl+S (Windows)

---

## Step 8: Test Your Setup! 🧪

### Test 1: Contact Form
1. **Open Main.html**
   - Right-click `Main.html` → Open with Live Server
   - Or open directly in browser

2. **Open Browser Console**
   - Press F12 or Right-click → Inspect
   - Go to Console tab

3. **Check for Success Message**
   - You should see: `"Firebase initialized successfully"`
   - ✅ If yes, Firebase is connected!
   - ❌ If error, check your config in firebase-config.js

4. **Submit Contact Form**
   - Scroll to footer
   - Fill out the contact form
   - Click "Send Message"
   - You should see: "Thank you! Your message has been sent successfully."

5. **Verify in Firebase Console**
   - Go back to Firebase Console
   - Navigate to Firestore Database
   - You should see a new collection: `contact_submissions`
   - Click it to see your test message!

### Test 2: Admin Dashboard
1. **Open admin.html**
   - Open `admin.html` in browser

2. **Login**
   - Use the email/password you created in Step 5
   - Click "Sign In"

3. **Check Dashboard**
   - You should see the dashboard with statistics
   - Click "Contact Messages" in sidebar
   - You should see your test message from Test 1!

---

## ✅ Setup Complete Checklist

- [ ] Firebase project created
- [ ] Web app registered and config copied
- [ ] Firestore Database enabled
- [ ] Firestore security rules set
- [ ] Authentication enabled
- [ ] Admin user created
- [ ] Cloud Storage enabled
- [ ] Storage rules set
- [ ] firebase-config.js updated with real credentials
- [ ] Contact form tested successfully
- [ ] Admin dashboard login works
- [ ] Data appears in Firebase Console

---

## 🎉 You're Done!

Your Firebase backend is now fully configured and working!

### What You Can Do Now:
- ✅ Receive contact form submissions
- ✅ Track donations
- ✅ Manage content via admin dashboard
- ✅ Upload gallery images
- ✅ Create events
- ✅ Export subscriber lists

### Next Steps:
1. **Deploy to Production**
   - Use Firebase Hosting: `firebase deploy`
   - Or upload to your web server

2. **Secure Your Rules**
   - Review security rules for production
   - Add rate limiting
   - Implement field validation

3. **Add Payment Gateway**
   - Integrate Razorpay/PayU for donations
   - Update donation-system.js with payment logic

---

## 🆘 Troubleshooting

### "Firebase not initialized" error
- Check that firebase-config.js has your real credentials
- Make sure Firebase SDK scripts are loaded before config
- Check browser console for specific errors

### "Permission denied" in Firestore
- Verify security rules are published
- Check that you're using test mode for development
- Ensure admin user is authenticated for admin operations

### Can't login to admin dashboard
- Verify email/password are correct
- Check that Authentication is enabled
- Look for errors in browser console

### Contact form not saving
- Check Firebase Console → Firestore for the collection
- Verify security rules allow create operations
- Check browser console for errors

---

## 📞 Need Help?

- **Firebase Documentation:** https://firebase.google.com/docs
- **Firestore Guide:** https://firebase.google.com/docs/firestore
- **Authentication Guide:** https://firebase.google.com/docs/auth

---

**Created:** December 2, 2025
**Status:** Ready to Use
**Estimated Setup Time:** 30-45 minutes
