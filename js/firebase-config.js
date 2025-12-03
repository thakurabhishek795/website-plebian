// Firebase Configuration
// Website Plebian - Firebase Project
const firebaseConfig = {
    apiKey: "AIzaSyAXyFQ4YBiY28WNtEZnTQj4msdeCqOuUmc",
    authDomain: "website-plebian.firebaseapp.com",
    projectId: "website-plebian",
    storageBucket: "website-plebian.firebasestorage.app",
    messagingSenderId: "835415358294",
    appId: "1:835415358294:web:f14461aaca61f7376a34f7",
    measurementId: "G-37NYWWDBSP"
};

// Initialize Firebase
let app, db, auth, storage, analytics;

try {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();

    // Initialize Analytics (optional)
    if (typeof firebase.analytics !== 'undefined') {
        analytics = firebase.analytics();
    }

    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Export for use in other files
window.firebaseApp = app;
window.db = db;
window.auth = auth;
window.storage = storage;
window.analytics = analytics;
