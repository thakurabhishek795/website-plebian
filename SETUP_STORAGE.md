# Setup Firebase Storage

It looks like Firebase Storage is not enabled for your project yet. You need to enable it in the Firebase Console before you can upload images.

## Step 1: Enable Storage in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/project/website-plebian/storage).
2. Click on **"Storage"** in the left sidebar (under "Build").
3. Click the **"Get started"** button.
4. **Security Rules**: Choose **"Start in production mode"** (we have our own rules ready to deploy). Click **Next**.
5. **Cloud Storage Location**: Choose a location close to your users (e.g., `nam5` for US). Click **Done**.
6. Wait for the setup to complete.

## Step 2: Deploy Storage Rules

Once Storage is enabled in the console, run the following command in your terminal to deploy your security rules:

```bash
firebase deploy --only storage
```

## Step 3: Configure CORS (Important for Localhost)

Since you are testing from `localhost`, you will likely encounter CORS errors (upload stuck at 0% or failing). To fix this, you need to configure CORS for your storage bucket.

1. Create a file named `cors.json` in your project folder with the following content:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600
  }
]
```

2. You need to use the Google Cloud CLI (`gcloud` or `gsutil`) to apply this configuration. If you don't have it installed, you can use the Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com/storage/browser?project=website-plebian).
   - Find your bucket (e.g., `website-plebian.appspot.com`).
   - Click on the **Configuration** tab (or "Permissions" > "CORS" depending on the UI version).
   - Or, simpler: **Install `gsutil`** and run:
     ```bash
     gsutil cors set cors.json gs://website-plebian.appspot.com
     ```

   **Alternative (No CLI):**
   If you cannot install `gsutil`, you can test your upload after deploying the website to Firebase Hosting (`firebase deploy`). CORS issues usually don't happen when the site is hosted on the same domain as the project (or authorized domains).

## Step 4: Verify

1. Refresh your admin dashboard.
2. Try uploading an image again.
