# Firebase CLI & Node.js Check

**Status**: ❌ Not Installed
**Reason**: Node.js is missing from your system.

## 🔍 Findings
I attempted to run the following commands:
- `firebase --version` -> Command not found
- `npx firebase --version` -> Command not found
- `node --version` -> Command not found

This means **Node.js** is not installed. The Firebase CLI requires Node.js to run.

## 🛠 How to Install (Recommended)

To use Firebase tools and deploy your website, you need to install Node.js:

1.  **Download**: Go to [nodejs.org](https://nodejs.org/)
2.  **Install**: Download the **LTS version** (Recommended for most users) and run the installer.
3.  **Verify**: After installing, close and reopen your terminal, then run:
    ```bash
    node --version
    npm --version
    ```

## 🚀 After Installing Node.js
Once Node.js is installed, you can install the Firebase CLI:
```bash
npm install -g firebase-tools
```

## ⚠️ Alternative: Continue Locally
Since you cannot deploy right now, we **MUST** fix the local issues to get your forms working.

**Please perform these checks in your Firebase Console:**
1.  **Create Database**: Ensure Firestore Database is created.
2.  **Update Rules**: Set rules to `allow create: if true;` for `contact_submissions`.
3.  **CORS**: For image uploads, you might still face issues locally.
