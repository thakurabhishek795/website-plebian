# Contact Form Verification Report

**Date**: December 3, 2025
**Status**: ✅ Connected / ⚠️ Firestore Rules Verification Needed

## 🔍 Verification Results

I have connected the "Send Message" contact form to the `contact_submissions` Firestore collection on all pages:

1.  **Main.html**: ✅ Connected (was already set up).
2.  **Donation.html**: ✅ Connected (Updated form IDs and added Firebase scripts).
3.  **Gallery.html**: ✅ Connected (Updated form IDs and added Firebase scripts).

## 🛠 How it Works

When a user submits the form:
1.  `js/script.js` intercepts the submission.
2.  It calls `submitContactForm` in `js/firebase-services.js`.
3.  Data is saved to the `contact_submissions` collection in Firestore.
4.  A success message is displayed to the user.

## ⚠️ Important: Firestore Rules

For the form to work for public users (who are not logged in), your **Firestore Security Rules** must allow public creation of documents in the `contact_submissions` collection.

**Please verify your rules in the Firebase Console:**

1.  Go to [Firebase Console](https://console.firebase.google.com/project/website-plebian/firestore/rules)
2.  Navigate to **Firestore Database** -> **Rules** tab.
3.  Ensure you have a rule like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow public to create contact submissions
    match /contact_submissions/{submissionId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // ... other rules
  }
}
```

If your rules are set to `allow write: if false;`, the form will fail with a "Permission Denied" error.

## 📝 Next Steps

1.  **Test the Form**: Open `Main.html` (or any other page) on your local server (`http://localhost:8000/Main.html`) and try sending a message.
2.  **Check Firestore**: Go to the Firebase Console and check the `contact_submissions` collection to see if the data appears.
