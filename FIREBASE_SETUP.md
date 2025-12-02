# Firebase Setup Guide for Plebian Collective Website

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `plebian-collective` (or your preferred name)
4. Enable Google Analytics (recommended) - Click **Continue**
5. Configure Google Analytics account or create a new one
6. Click **"Create project"** and wait for it to be ready
7. Click **"Continue"** when the project is ready

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Plebian Collective Website`
3. Check **"Also set up Firebase Hosting"** (optional but recommended)
4. Click **"Register app"**
5. **IMPORTANT:** Copy the Firebase configuration object that appears

## Step 3: Update Firebase Configuration

1. Open the file: `js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX"
};
```

## Step 4: Enable Firebase Services

### A. Firestore Database
1. In Firebase Console, go to **"Build" → "Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a location (e.g., `asia-south1` for India)
5. Click **"Enable"**

### B. Authentication (Optional - for admin panel)
1. Go to **"Build" → "Authentication"**
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Save"**

### C. Storage (for gallery images)
1. Go to **"Build" → "Storage"**
2. Click **"Get started"**
3. Start in **"Test mode"**
4. Click **"Next"** and then **"Done"**

## Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with:

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

3. Click **"Publish"**

## Step 6: Set Up Storage Security Rules

1. In Storage, go to the **"Rules"** tab
2. Replace with:

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

3. Click **"Publish"**

## Step 7: Add Firebase to Your HTML Pages

Add these script tags to the `<head>` section of your HTML files (Main.html, Gallery.html, Donation.html):

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics-compat.js"></script>

<!-- Firebase Configuration -->
<script src="js/firebase-config.js"></script>
<script src="js/firebase-services.js"></script>
```

## Step 8: Test Firebase Connection

1. Open your website in a browser
2. Open the browser console (F12 or Right-click → Inspect → Console)
3. You should see: `"Firebase initialized successfully"`
4. If you see errors, check your configuration

## Step 9: Create Initial Collections (Optional)

You can create these collections manually in Firestore or they'll be created automatically when data is first added:

- `contact_submissions`
- `donations`
- `newsletter_subscribers`
- `gallery_images`
- `events`
- `event_registrations`

## Step 10: Update .gitignore

Make sure your `.gitignore` file includes:

```
# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# Don't commit Firebase config with real credentials
# js/firebase-config.js  # Uncomment if you want to keep credentials private
```

## Next Steps

### Implement Features:
1. ✅ Contact form with Firebase integration
2. ✅ Donation tracking system
3. ✅ Newsletter subscription
4. ✅ Dynamic gallery from Firebase Storage
5. ✅ Event management system

### Optional Enhancements:
- Create an admin dashboard for managing content
- Set up Firebase Hosting for deployment
- Implement email notifications using Firebase Functions
- Add real-time donation counter
- Create volunteer registration system

## Useful Firebase Console Links

- **Project Overview:** https://console.firebase.google.com/project/YOUR_PROJECT_ID
- **Firestore Database:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Authentication:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication
- **Storage:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage
- **Analytics:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/analytics

## Troubleshooting

### Common Issues:

1. **"Firebase not defined" error**
   - Make sure Firebase SDK scripts are loaded before firebase-config.js

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Make sure you're in test mode for development

3. **CORS errors**
   - Make sure you're accessing the site via a web server (not file://)
   - Use Live Server extension in VS Code or run `python -m http.server`

## Support

For more help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase YouTube Channel](https://www.youtube.com/firebase)

---

**Created for Plebian Collective Website**
Last Updated: December 2, 2025
