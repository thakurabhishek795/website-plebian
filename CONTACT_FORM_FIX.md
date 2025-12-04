# Contact Form Database Setup Guide

## Issue
The "Send Message" feature was not working because the Firebase Firestore security rules were not properly configured.

## What Was Fixed

### 1. **Updated Contact Form** (`Main.html`)
- ✅ Added a phone number field to match the database schema
- The form now collects: name, email, phone (optional), and message

### 2. **Updated JavaScript Handler** (`js/script.js`)
- ✅ Updated to capture the phone field
- ✅ Proper validation for required fields

### 3. **Updated Firebase Service** (`js/firebase-services.js`)
- ✅ Added phone field to the database submission
- The data now matches the `contact_submissions` schema exactly

### 4. **Created Firestore Security Rules** (`firestore.rules`)
- ✅ Allow public users to submit contact forms
- ✅ Only authenticated admins can read/update/delete submissions

## How to Deploy the Firestore Rules

### Option 1: Using Firebase Console (Recommended for Quick Fix)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **website-plebian**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click **Publish**

### Option 2: Using Firebase CLI

If you have Firebase CLI installed, you can deploy the rules automatically:

```bash
# Make sure you're in the project directory
cd "/Users/athakur/Downloads/Website Plebian"

# Login to Firebase (if not already logged in)
firebase login

# Deploy only the Firestore rules
firebase deploy --only firestore:rules
```

## Testing the Contact Form

### Method 1: Use the Test Page
1. Open `test-contact-form.html` in your browser
2. Click "Test Firebase Connection" to verify Firebase is working
3. Click "Test Contact Form" to submit a test message
4. Check the log output for any errors

### Method 2: Test on the Main Page
1. Open `Main.html` in your browser
2. Scroll down to the contact form in the footer
3. Fill in:
   - Your Name
   - Your Email
   - Phone Number (optional)
   - Message
4. Click "Send Message"
5. You should see a success message

## Verifying Submissions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **website-plebian**
3. Click on **Firestore Database**
4. Look for the `contact_submissions` collection
5. You should see the submitted entries with:
   - `name`
   - `email`
   - `phone`
   - `message`
   - `timestamp`
   - `status: 'new'`

## Database Schema

The contact form now submits data matching this schema:

```javascript
{
  name: string (required),
  email: string (required),
  phone: string (optional),
  message: string (required),
  timestamp: timestamp (auto-generated),
  status: 'new'
}
```

## Troubleshooting

### If you get "Permission Denied" error:
- Make sure the Firestore rules have been deployed (see steps above)
- The rules should allow public `create` access to `contact_submissions`

### If Firebase is not initialized:
- Check browser console for errors
- Verify `firebase-config.js` is loaded before other scripts
- Make sure all Firebase SDK scripts are loaded

### If the form doesn't submit:
- Open browser console (F12) and check for JavaScript errors
- Use the test page (`test-contact-form.html`) to diagnose the issue
- Check network tab to see if the request is being made

## Next Steps

After deploying the rules, you should:

1. ✅ Test the contact form on your website
2. ✅ Set up email notifications for new submissions (optional)
3. ✅ Use the admin dashboard to view and manage submissions

---

**Created:** 2025-12-04
**Last Updated:** 2025-12-04
