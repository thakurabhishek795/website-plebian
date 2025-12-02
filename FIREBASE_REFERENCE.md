# Firebase Quick Reference

## 📋 Available Functions

### Contact Form
```javascript
// Submit contact form
const result = await firebaseServices.submitContactForm({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
});
```

### Donations
```javascript
// Record a donation
const result = await firebaseServices.recordDonation({
    amount: 1000,
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '9876543210',
    paymentMethod: 'online'
});

// Get total donations
const total = await firebaseServices.getTotalDonations();
console.log(total.total); // Total amount
console.log(total.count); // Number of donors
```

### Newsletter
```javascript
// Subscribe to newsletter
const result = await firebaseServices.subscribeToNewsletter(
    'subscriber@example.com',
    'Subscriber Name'
);
```

### Gallery
```javascript
// Get gallery images
const result = await firebaseServices.getGalleryImages('community');
// category options: 'all', 'community', 'education', 'environment', 'empowerment', 'medical'

// Upload image (requires authentication)
const file = document.getElementById('fileInput').files[0];
const result = await firebaseServices.uploadGalleryImage(file, {
    title: 'Community Event',
    category: 'community',
    description: 'Annual community gathering'
});
```

### Events
```javascript
// Get upcoming events
const events = await firebaseServices.getUpcomingEvents();

// Register for event
const result = await firebaseServices.registerForEvent('eventId123', {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
});
```

### Analytics
```javascript
// Log page view
firebaseServices.logPageView('Home Page');

// Log donation click
firebaseServices.logDonationClick(1000);
```

## 🗄️ Database Collections

### contact_submissions
```javascript
{
    name: string,
    email: string,
    message: string,
    timestamp: timestamp,
    status: 'new' | 'read' | 'replied'
}
```

### donations
```javascript
{
    amount: number,
    donorName: string,
    donorEmail: string,
    donorPhone: string,
    paymentMethod: string,
    timestamp: timestamp,
    status: 'pending' | 'completed' | 'failed'
}
```

### newsletter_subscribers
```javascript
{
    email: string,
    name: string,
    subscribedAt: timestamp,
    active: boolean
}
```

### gallery_images
```javascript
{
    url: string,
    title: string,
    category: string,
    description: string,
    uploadedAt: timestamp
}
```

### events
```javascript
{
    title: string,
    description: string,
    eventDate: timestamp,
    location: string,
    maxParticipants: number,
    createdAt: timestamp
}
```

### event_registrations
```javascript
{
    eventId: string,
    name: string,
    email: string,
    phone: string,
    registeredAt: timestamp,
    status: 'confirmed' | 'cancelled'
}
```

## 🔐 Security Rules Summary

- **Public Write, Admin Read**: contact_submissions, donations, newsletter_subscribers, event_registrations
- **Public Read, Admin Write**: gallery_images, events
- **Admin Only**: All update and delete operations

## 📊 Common Queries

### Get all new contact submissions
```javascript
const snapshot = await db.collection('contact_submissions')
    .where('status', '==', 'new')
    .orderBy('timestamp', 'desc')
    .get();
```

### Get donations by date range
```javascript
const startDate = firebase.firestore.Timestamp.fromDate(new Date('2024-01-01'));
const endDate = firebase.firestore.Timestamp.fromDate(new Date('2024-12-31'));

const snapshot = await db.collection('donations')
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();
```

### Count active newsletter subscribers
```javascript
const snapshot = await db.collection('newsletter_subscribers')
    .where('active', '==', true)
    .get();
console.log(snapshot.size);
```

## 🚀 Next Steps

1. Complete Firebase Console setup (see FIREBASE_SETUP.md)
2. Add Firebase scripts to HTML pages
3. Update firebase-config.js with your credentials
4. Test contact form integration
5. Implement donation tracking
6. Set up admin dashboard (optional)

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
