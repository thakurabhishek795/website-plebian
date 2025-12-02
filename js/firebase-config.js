// Firebase Configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
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
