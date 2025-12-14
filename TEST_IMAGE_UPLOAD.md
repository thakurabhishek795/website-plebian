# Test Image Upload Feature

## Current Status

✅ **Firestore Rules Deployed** - Gallery images can be read and written by authenticated users
✅ **Gallery Loading Fixed** - Admin dashboard now shows "No images yet" instead of errors
✅ **Storage Configuration Ready** - `storage.rules` and `cors.json` files created

⚠️ **Storage Rules Not Yet Deployed** - Waiting for Firebase Storage to be fully initialized

## Step-by-Step Upload Test

### 1. Verify Firebase Storage is Enabled

1. Go to [Firebase Console - Storage](https://console.firebase.google.com/project/website-plebian/storage)
2. You should see a Storage bucket named `website-plebian.appspot.com`
3. If you see "Get Started" instead, click it to enable Storage

### 2. Deploy Storage Rules (Once Enabled)

Once Storage is visible in the console, run:

```bash
cd "/Users/athakur/Downloads/Website Plebian"
firebase deploy --only storage --project website-plebian
```

**Expected Output:**
```
✔ storage: released rules storage.rules to firebase.storage/website-plebian.appspot.com
✔ Deploy complete!
```

### 3. Test Upload from Admin Dashboard

1. Open http://localhost:8000/admin.html
2. Login with your admin credentials:
   - Email: `admin@plebiancollective.org`
   - Password: `Admin@123`
3. Click **"Gallery"** in the sidebar
4. Click **"Upload Image"** button
5. Fill in the form:
   - **Title**: "Test Image 1"
   - **Category**: Choose any (e.g., "Events")
   - **Description**: "Testing image upload feature"
   - **File**: Select any image from your computer (JPG, PNG, etc.)
6. Click **"Upload"**

### 4. What to Expect

**If Successful:**
- Progress bar fills from 0% to 100%
- Message: "Upload complete! Refreshing..."
- The image appears in the gallery grid below
- The image is also visible in Firebase Console → Storage → gallery folder

**If Upload Fails:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Permission Denied" | Storage rules not deployed | Run `firebase deploy --only storage` |
| "Stuck at 0%" | CORS issue from localhost | Apply CORS config (see below) |
| "Please select an image file" | No file selected | Choose a file first |
| "You must be signed in" | Not logged in | Login to admin dashboard |

### 5. Apply CORS Configuration (If Needed)

If the upload gets stuck at 0% or fails with CORS errors, you need to apply the CORS configuration.

**Option A: Using gsutil (Recommended)**

Install Google Cloud SDK if you haven't:
```bash
# On macOS
brew install google-cloud-sdk

# Initialize
gcloud init --project=website-plebian

# Apply CORS
gsutil cors set cors.json gs://website-plebian.appspot.com
```

**Option B: Deploy to Firebase Hosting First**

CORS issues usually don't occur when accessing from the same domain:
```bash
firebase deploy --project website-plebian
```

Then test the upload from the live site instead of localhost.

**Option C: Via Firebase Console**

1. Go to [Google Cloud Console - Storage](https://console.cloud.google.com/storage/browser?project=website-plebian)
2. Click on your bucket (`website-plebian.appspot.com`)
3. Go to **Configuration** tab
4. Edit CORS configuration and paste:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600
  }
]
```

### 6. Verify Upload in Firebase Console

After a successful upload:

1. Go to [Firebase Console - Storage](https://console.firebase.google.com/project/website-plebian/storage)
2. Navigate to the `gallery` folder
3. You should see your uploaded image file
4. Go to [Firestore Console - gallery_images](https://console.firebase.google.com/project/website-plebian/firestore/databases/-default-/data/~2Fgallery_images)
5. You should see a new document with metadata (title, category, url, etc.)

### 7. Verify Display

1. Go back to Admin Dashboard → Gallery
2. The uploaded image should appear in the grid
3. Verify the title, category, and timestamp are correct
4. Try deleting the image (trash icon) to test delete functionality

## Troubleshooting

### Check Browser Console (F12)

Look for these specific errors:

**"FirebaseError: Missing or insufficient permissions"**
- Solution: Deploy storage rules (`firebase deploy --only storage`)

**"Access to fetch at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:8000' has been blocked by CORS policy"**
- Solution: Apply CORS configuration (see step 5)

**"Upload is stuck at 0%"**
- Solution: CORS issue, see step 5

### Check Storage Rules

Current storage rules in `storage.rules`:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

This allows:
- ✅ Anyone to read gallery images (public)
- ✅ Only authenticated users to upload
- ✅ Only authenticated users to update/delete

## Success Criteria

Upload feature is working if:
- [  ] Storage rules deployed without errors
- [  ] Upload progress bar reaches 100%
- [  ] Image appears in Admin Dashboard gallery
- [  ] Image file exists in Firebase Storage console
- [  ] Metadata document exists in Firestore `gallery_images` collection
- [  ] No CORS errors in browser console

## Next Steps After Successful Upload

1. Test uploading multiple images
2. Test different image formats (JPG, PNG, WEBP)
3. Test deleting images
4. Test viewing images on the public Gallery page (Gallery.html)
5. Deploy to Firebase Hosting for production use

---

**Last Updated:** December 4, 2025
**Status:** Awaiting Firebase Storage full initialization
