# Firebase Admin User Setup Guide

This guide will help you create an admin user for your Plebian Collective website dashboard.

## Prerequisites
- A Firebase account (free tier is sufficient)
- Your Firebase project already created

---

## Method 1: Create Admin User via Firebase Console (Recommended)

### Step 1: Access Firebase Console
1. Open your browser and go to: **https://console.firebase.google.com**
2. Sign in with your Google account
3. Select your project (or create a new one if you haven't already)

### Step 2: Enable Authentication
1. In the left sidebar, click on **"Build"** → **"Authentication"**
2. Click on **"Get Started"** (if this is your first time)
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

### Step 3: Create Admin User
1. Go to the **"Users"** tab in Authentication
2. Click **"Add user"** button (top right)
3. Enter your admin credentials:
   - **Email**: `admin@plebiancollective.org` (or your preferred email)
   - **Password**: Create a strong password (minimum 6 characters)
4. Click **"Add user"**

### Step 4: Note Your Credentials
**Save these credentials securely:**
- Email: `_________________`
- Password: `_________________`

---

## Method 2: Create Admin User via Code (Alternative)

If you prefer to create the admin user programmatically, follow these steps:

### Step 1: Create a Temporary Setup Page

Create a file called `create-admin.html` in your project root with this content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Create Admin User</title>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <script src="js/firebase-config.js"></script>
</head>
<body>
    <h1>Create Admin User</h1>
    <form id="createAdminForm">
        <input type="email" id="email" placeholder="Admin Email" required><br><br>
        <input type="password" id="password" placeholder="Password (min 6 chars)" required><br><br>
        <button type="submit">Create Admin User</button>
    </form>
    <div id="result"></div>

    <script>
        document.getElementById('createAdminForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const resultDiv = document.getElementById('result');

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                resultDiv.innerHTML = `<p style="color: green;">✅ Admin user created successfully!<br>Email: ${email}</p>`;
                console.log('User created:', userCredential.user);
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: red;">❌ Error: ${error.message}</p>`;
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>
```

### Step 2: Use the Setup Page
1. Make sure your `firebase-config.js` has the correct Firebase credentials
2. Open `create-admin.html` in your browser
3. Enter your desired admin email and password
4. Click "Create Admin User"
5. **IMPORTANT**: Delete this file after creating the admin user for security

---

## Method 3: Using Firebase CLI (Advanced)

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create admin user using Firebase Auth
firebase auth:import users.json --project YOUR_PROJECT_ID
```

Create a `users.json` file:
```json
{
  "users": [
    {
      "localId": "admin001",
      "email": "admin@plebiancollective.org",
      "emailVerified": true,
      "passwordHash": "YOUR_HASHED_PASSWORD",
      "salt": "YOUR_SALT",
      "createdAt": "1234567890123",
      "lastSignedInAt": "1234567890123"
    }
  ]
}
```

---

## Verifying Your Setup

### Test the Admin Login
1. Open `admin.html` in your browser
2. Enter the email and password you just created
3. Click "Sign In"
4. You should see the admin dashboard

### Troubleshooting

**Error: "Firebase not initialized"**
- Make sure you've updated `js/firebase-config.js` with your actual Firebase credentials
- Check the browser console for errors

**Error: "Invalid email or password"**
- Double-check your credentials
- Ensure Email/Password authentication is enabled in Firebase Console

**Error: "auth/weak-password"**
- Password must be at least 6 characters long

**Error: "auth/email-already-in-use"**
- This email is already registered
- Use a different email or reset the password in Firebase Console

---

## Security Best Practices

1. ✅ **Use a strong password** (mix of uppercase, lowercase, numbers, symbols)
2. ✅ **Don't share admin credentials** with unauthorized users
3. ✅ **Enable 2FA** (Two-Factor Authentication) in Firebase Console
4. ✅ **Regularly review** the Users list in Firebase Console
5. ✅ **Delete test/temporary admin accounts** after setup
6. ✅ **Use environment variables** for sensitive data in production

---

## Next Steps

After creating your admin user:

1. ✅ Test login at `admin.html`
2. ✅ Explore the dashboard features
3. ✅ Set up Firebase Security Rules (see `DATABASE_SCHEMA.md`)
4. ✅ Configure email verification (optional)
5. ✅ Set up password reset functionality (optional)

---

## Quick Reference

**Firebase Console**: https://console.firebase.google.com
**Admin Dashboard**: `admin.html`
**Documentation**: See `FIREBASE_SETUP.md` for complete Firebase setup

---

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Review `FIREBASE_SETUP.md` for configuration details
3. Verify your Firebase project settings
4. Check Firebase Console → Authentication → Users

---

**Created**: December 3, 2025
**Last Updated**: December 3, 2025
