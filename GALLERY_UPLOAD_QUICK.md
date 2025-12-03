# Gallery Upload - Quick Reference

## ✅ What's Connected

Your gallery upload is now fully connected to Firebase Storage!

### Upload Destination
- **Firebase Storage Path**: `gallery/{timestamp}-{title}.{extension}`
- **Firestore Collection**: `gallery_images`

### How It Works
1. Admin uploads image via admin dashboard
2. Image is saved to Firebase Storage `gallery/` folder
3. Metadata is saved to Firestore `gallery_images` collection
4. Image appears in admin gallery view
5. Image can be deleted (removes from both Storage and Firestore)

---

## 🚀 Quick Start

### Upload an Image
1. Login to `admin.html`
2. Click "Gallery" in sidebar
3. Click "Upload Image" button
4. Select image file (max 5MB)
5. Enter title and category
6. Click "Upload"
7. Wait for progress bar to complete

### View Images
- All images appear in the gallery grid
- Shows: preview, title, category, description, upload date
- Click trash icon to delete

---

## 📁 Storage Structure

```
Firebase Storage:
└── gallery/
    ├── 1733203200000-community-event.jpg
    ├── 1733203300000-activism-march.png
    └── ...

Firestore Database:
└── gallery_images/
    ├── {doc-id}/
    │   ├── title
    │   ├── category
    │   ├── description
    │   ├── url (Firebase Storage URL)
    │   ├── fileName
    │   ├── storagePath
    │   ├── uploadedBy
    │   ├── uploadedAt
    │   └── active: true
```

---

## 🔒 Security Rules Needed

### Firebase Storage Rules
```javascript
match /gallery/{imageId} {
  allow read: if true;
  allow write, delete: if request.auth != null;
}
```

### Firestore Rules
```javascript
match /gallery_images/{imageId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null;
}
```

**Apply these in Firebase Console!**

---

## ✅ Features Implemented

- ✅ Image upload to Firebase Storage `gallery/` folder
- ✅ Metadata storage in Firestore
- ✅ File validation (size, type)
- ✅ Image preview before upload
- ✅ Upload progress tracking
- ✅ Automatic filename generation
- ✅ Category organization
- ✅ Image deletion (Storage + Firestore)
- ✅ Gallery display in admin dashboard
- ✅ Stats tracking

---

## 📝 Files Modified

1. `admin.html` - Added upload modal
2. `js/admin-dashboard.js` - Added upload functionality

---

## 🎯 Next Steps

1. **Set up Firebase Security Rules** (see above)
2. **Test upload** with a sample image
3. **Integrate with Gallery.html** to display on public page

---

For detailed documentation, see `GALLERY_UPLOAD_GUIDE.md`
