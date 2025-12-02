// Firebase Services - Helper functions for common operations

// ==================== CONTACT FORM ====================
async function submitContactForm(formData) {
    try {
        const docRef = await db.collection('contact_submissions').add({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'new'
        });

        console.log('Contact form submitted with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: error.message };
    }
}

// ==================== DONATIONS ====================
async function recordDonation(donationData) {
    try {
        const docRef = await db.collection('donations').add({
            amount: donationData.amount,
            donorName: donationData.name,
            donorEmail: donationData.email,
            donorPhone: donationData.phone || '',
            paymentMethod: donationData.paymentMethod || 'online',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        });

        console.log('Donation recorded with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error recording donation:', error);
        return { success: false, error: error.message };
    }
}

// Get total donations (for impact counter)
async function getTotalDonations() {
    try {
        const snapshot = await db.collection('donations')
            .where('status', '==', 'completed')
            .get();

        let total = 0;
        snapshot.forEach(doc => {
            total += parseFloat(doc.data().amount) || 0;
        });

        return { success: true, total: total, count: snapshot.size };
    } catch (error) {
        console.error('Error getting total donations:', error);
        return { success: false, error: error.message };
    }
}

// ==================== NEWSLETTER ====================
async function subscribeToNewsletter(email, name = '') {
    try {
        // Check if email already exists
        const existing = await db.collection('newsletter_subscribers')
            .where('email', '==', email)
            .get();

        if (!existing.empty) {
            return { success: false, error: 'Email already subscribed' };
        }

        const docRef = await db.collection('newsletter_subscribers').add({
            email: email,
            name: name,
            subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
            active: true
        });

        console.log('Newsletter subscription added with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return { success: false, error: error.message };
    }
}

// ==================== GALLERY ====================
async function getGalleryImages(category = 'all') {
    try {
        let query = db.collection('gallery_images').orderBy('uploadedAt', 'desc');

        if (category !== 'all') {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        const images = [];

        snapshot.forEach(doc => {
            images.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, images: images };
    } catch (error) {
        console.error('Error getting gallery images:', error);
        return { success: false, error: error.message };
    }
}

// Upload image to Firebase Storage
async function uploadGalleryImage(file, metadata) {
    try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`gallery/${Date.now()}_${file.name}`);

        // Upload file
        const snapshot = await imageRef.put(file);

        // Get download URL
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Save metadata to Firestore
        const docRef = await db.collection('gallery_images').add({
            url: downloadURL,
            title: metadata.title || '',
            category: metadata.category || 'community',
            description: metadata.description || '',
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, id: docRef.id, url: downloadURL };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
}

// ==================== EVENTS ====================
async function getUpcomingEvents() {
    try {
        const now = firebase.firestore.Timestamp.now();
        const snapshot = await db.collection('events')
            .where('eventDate', '>=', now)
            .orderBy('eventDate', 'asc')
            .limit(10)
            .get();

        const events = [];
        snapshot.forEach(doc => {
            events.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, events: events };
    } catch (error) {
        console.error('Error getting events:', error);
        return { success: false, error: error.message };
    }
}

// Register for an event
async function registerForEvent(eventId, userData) {
    try {
        const docRef = await db.collection('event_registrations').add({
            eventId: eventId,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'confirmed'
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error registering for event:', error);
        return { success: false, error: error.message };
    }
}

// ==================== ANALYTICS ====================
function logPageView(pageName) {
    if (analytics) {
        analytics.logEvent('page_view', {
            page_title: pageName,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
}

function logDonationClick(amount) {
    if (analytics) {
        analytics.logEvent('donation_initiated', {
            value: amount,
            currency: 'INR'
        });
    }
}

// Export functions for global use
window.firebaseServices = {
    submitContactForm,
    recordDonation,
    getTotalDonations,
    subscribeToNewsletter,
    getGalleryImages,
    uploadGalleryImage,
    getUpcomingEvents,
    registerForEvent,
    logPageView,
    logDonationClick
};
