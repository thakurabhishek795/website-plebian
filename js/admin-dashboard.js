// Admin Dashboard JavaScript
// Handles authentication, data loading, and admin operations

let currentUser = null;

// ==================== AUTHENTICATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication state
    if (auth) {
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                showDashboard(user);
            } else {
                showLogin();
            }
        });
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');

    loginButton.textContent = 'Signing in...';
    loginButton.disabled = true;
    loginError.classList.add('hidden');

    try {
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged will handle the redirect
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Invalid email or password';
        loginError.classList.remove('hidden');
        loginButton.textContent = 'Sign In';
        loginButton.disabled = false;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.signOut();
    }
}

function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboardScreen').classList.add('hidden');
}

function showDashboard(user) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');
    document.getElementById('adminEmail').textContent = user.email;

    // Load dashboard data
    loadDashboardData();
    // Run a quick Firebase connectivity test for visibility
    try {
        testFirebaseConnection();
    } catch (e) {
        console.warn('testFirebaseConnection not available yet', e);
    }
}

// ==================== NAVIGATION ====================
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-brand-50', 'text-brand-600');
    });

    // Show selected section
    document.getElementById('section-' + sectionName).classList.remove('hidden');

    // Add active class to clicked nav button
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('bg-brand-50', 'text-brand-600');

    // Load section-specific data
    loadSectionData(sectionName);
}

// ==================== DATA LOADING ====================
async function loadDashboardData() {
    loadOverviewStats();
    loadRecentActivity();
}

async function loadOverviewStats() {
    try {
        // Load donations
        const donationsResult = await window.firebaseServices.getTotalDonations();
        if (donationsResult.success) {
            const formatted = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(donationsResult.total);
            document.getElementById('stat-donations').textContent = formatted;
        }

        // Load contacts count
        const contactsSnapshot = await db.collection('contact_submissions').get();
        document.getElementById('stat-contacts').textContent = contactsSnapshot.size;

        // Count new contacts
        const newContacts = await db.collection('contact_submissions')
            .where('status', '==', 'new')
            .get();
        document.getElementById('contactBadge').textContent = newContacts.size;

        // Load subscribers count
        const subscribersSnapshot = await db.collection('newsletter_subscribers')
            .where('active', '==', true)
            .get();
        document.getElementById('stat-subscribers').textContent = subscribersSnapshot.size;

        // Load gallery images count
        const imagesSnapshot = await db.collection('gallery_images').get();
        document.getElementById('stat-images').textContent = imagesSnapshot.size;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadRecentActivity() {
    const activityDiv = document.getElementById('recentActivity');
    activityDiv.innerHTML = '<p class="text-gray-500 text-sm">Loading...</p>';

    try {
        const activities = [];

        // Get recent contacts
        const contacts = await db.collection('contact_submissions')
            .orderBy('timestamp', 'desc')
            .limit(3)
            .get();

        contacts.forEach(doc => {
            const data = doc.data();
            activities.push({
                icon: 'envelope',
                color: 'purple',
                text: `New contact from ${data.name}`,
                time: formatTimestamp(data.timestamp)
            });
        });

        // Get recent donations
        const donations = await db.collection('donations')
            .orderBy('timestamp', 'desc')
            .limit(3)
            .get();

        donations.forEach(doc => {
            const data = doc.data();
            activities.push({
                icon: 'hand-holding-heart',
                color: 'green',
                text: `New donation of ₹${data.amount} from ${data.donorName}`,
                time: formatTimestamp(data.timestamp)
            });
        });

        // Sort by time
        activities.sort((a, b) => b.time.localeCompare(a.time));

        // Display
        if (activities.length === 0) {
            activityDiv.innerHTML = '<p class="text-gray-500 text-sm">No recent activity</p>';
        } else {
            activityDiv.innerHTML = activities.slice(0, 5).map(activity => `
                <div class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                    <div class="w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fa-solid fa-${activity.icon} text-${activity.color}-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-900">${activity.text}</p>
                        <p class="text-xs text-gray-500">${activity.time}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
        activityDiv.innerHTML = '<p class="text-red-500 text-sm">Error loading activity</p>';
    }
}

async function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'contacts':
            loadContacts();
            break;
        case 'donations':
            loadDonations();
            break;
        case 'newsletter':
            loadSubscribers();
            break;
        case 'gallery':
            loadGallery();
            break;
        case 'events':
            loadEvents();
            break;
    }
}

// ==================== CONTACTS ====================
async function loadContacts() {
    const tableBody = document.getElementById('contactsTable');
    tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>';

    try {
        const snapshot = await db.collection('contact_submissions')
            .limit(50)
            .get();

        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No messages yet</td></tr>';
            return;
        }

        tableBody.innerHTML = '';

        // Convert to array and sort client-side to handle missing timestamps
        const docs = [];
        snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));

        docs.sort((a, b) => {
            const timeA = a.timestamp && a.timestamp.toMillis ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp && b.timestamp.toMillis ? b.timestamp.toMillis() : 0;
            return timeB - timeA;
        });

        docs.forEach(data => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-900">${data.name || 'No Name'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${data.email || 'No Email'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${data.phone || 'No Phone'}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${data.message || ''}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${formatTimestamp(data.timestamp)}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full ${data.status === 'new' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }">
                        ${data.status || 'new'}
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Error loading messages</td></tr>';
    }
}

function refreshContacts() {
    loadContacts();
}

// ==================== DONATIONS ====================
async function loadDonations() {
    const tableBody = document.getElementById('donationsTable');
    tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>';

    try {
        const snapshot = await db.collection('donations')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No donations yet</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-900">${data.donorName}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${data.donorEmail}</td>
                <td class="px-6 py-4 text-sm font-bold text-brand-600">₹${data.amount.toLocaleString('en-IN')}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${formatTimestamp(data.timestamp)}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full ${data.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    data.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                }">
                        ${data.paymentStatus || 'pending'}
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading donations:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Error loading donations</td></tr>';
    }
}

function refreshDonations() {
    loadDonations();
}

// ==================== NEWSLETTER ====================
async function loadSubscribers() {
    const tableBody = document.getElementById('subscribersTable');
    tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>';

    try {
        const snapshot = await db.collection('newsletter_subscribers')
            .orderBy('subscribedAt', 'desc')
            .get();

        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No subscribers yet</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-900">${data.email}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${data.name || '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${formatTimestamp(data.subscribedAt)}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full ${data.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }">
                        ${data.active ? 'Active' : 'Inactive'}
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading subscribers:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Error loading subscribers</td></tr>';
    }
}

function exportSubscribers() {
    alert('Export functionality will download a CSV file with all subscriber emails.');
    // In production, implement actual CSV export
}

// ==================== GALLERY ====================
async function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '<p class="text-gray-500">Loading...</p>';

    try {
        const snapshot = await db.collection('gallery_images')
            .where('active', '==', true)
            .orderBy('uploadedAt', 'desc')
            .get();

        if (snapshot.empty) {
            galleryGrid.innerHTML = '<p class="text-gray-500">No images yet. Click "Upload Image" to add your first image!</p>';
            return;
        }

        galleryGrid.innerHTML = '';
        snapshot.forEach(doc => {
            const image = doc.data();
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition group relative';
            card.innerHTML = `
                <img src="${image.url}" alt="${image.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h4 class="font-bold text-sm text-gray-900 mb-1">${image.title}</h4>
                    <p class="text-xs text-gray-500 mb-2">
                        <i class="fa-solid fa-tag mr-1"></i>${image.category}
                    </p>
                    ${image.description ? `<p class="text-xs text-gray-600 mb-2">${image.description}</p>` : ''}
                    <div class="flex items-center justify-between text-xs text-gray-400">
                        <span><i class="fa-solid fa-clock mr-1"></i>${formatTimestamp(image.uploadedAt)}</span>
                        <button onclick="deleteImage('${doc.id}', '${image.storagePath}')" 
                            class="text-red-600 hover:text-red-800 transition">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p class="text-red-500">Error loading images. Please try again.</p>';
    }
}

async function deleteImage(imageId, storagePath) {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
        return;
    }

    try {
        // Delete from Storage
        const storageRef = storage.ref(storagePath);
        await storageRef.delete();

        // Delete from Firestore
        await db.collection('gallery_images').doc(imageId).delete();

        // Reload gallery
        loadGallery();
        loadOverviewStats();

        alert('Image deleted successfully!');
    } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image: ' + error.message);
    }
}

function showUploadModal() {
    document.getElementById('uploadModal').classList.remove('hidden');
    resetUploadForm();
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.add('hidden');
    resetUploadForm();
}

function resetUploadForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('uploadProgress').classList.add('hidden');
    document.getElementById('uploadError').classList.add('hidden');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('uploadButton').disabled = false;
}

// Image file preview
document.addEventListener('DOMContentLoaded', function () {
    const imageFileInput = document.getElementById('imageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    showUploadError('File size must be less than 5MB');
                    e.target.value = '';
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showUploadError('Please select a valid image file');
                    e.target.value = '';
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('previewImg').src = e.target.result;
                    document.getElementById('imagePreview').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Upload form handler
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleImageUpload);
    }
});

function showUploadError(message) {
    const errorDiv = document.getElementById('uploadError');
    // Accept either a string or an Error/object
    if (message && typeof message === 'object') {
        // Try to extract common fields
        const code = message.code || message.errorCode || (message.name || 'Error');
        const msg = message.message || message.toString();
        errorDiv.innerHTML = `<strong>${code}:</strong> ${escapeHtml(msg)}`;
        // Also include a collapsible JSON dump for debugging
        try {
            const dump = JSON.stringify(message, Object.keys(message), 2);
            errorDiv.innerHTML += `<pre class="text-xs mt-2 bg-white p-2 rounded text-left overflow-auto">${escapeHtml(dump)}</pre>`;
        } catch (e) {
            // ignore
        }
    } else {
        errorDiv.textContent = message || 'An unknown error occurred';
    }
    errorDiv.classList.remove('hidden');
    // Keep visible longer for debugging
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 15000);
}

// Small helper to escape HTML when inserting error text
function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function handleImageUpload(e) {
    e.preventDefault();

    // Ensure admin is signed in before uploading
    if (!currentUser) {
        showUploadError('You must be signed in to upload images. Please sign in and try again.');
        return;
    }

    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];

    if (!file) {
        showUploadError('Please select an image file');
        return;
    }

    const title = document.getElementById('imageTitle').value.trim();
    const category = document.getElementById('imageCategory').value;
    const description = document.getElementById('imageDescription').value.trim();

    // Disable upload button
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.disabled = true;
    uploadButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Starting...';

    // Show progress
    document.getElementById('uploadProgress').classList.remove('hidden');
    document.getElementById('uploadError').classList.add('hidden');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').textContent = 'Initializing upload...';

    try {
        // Create a unique filename
        const timestamp = Date.now();
        const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}-${sanitizedTitle}.${fileExtension}`;

        console.log('Starting upload for:', fileName);

        // Upload to Firebase Storage in gallery folder
        const storageRef = storage.ref(`gallery/${fileName}`);
        const uploadTask = storageRef.put(file);

        // Timeout check (if stuck at 0% for more than 10 seconds)
        const timeoutCheck = setTimeout(() => {
            if (document.getElementById('progressBar').style.width === '0%') {
                console.warn('Upload appears to be stuck at 0%');
                showUploadError('Upload is stuck at 0%. This is usually a CORS or Permissions issue. Check Console (F12) for details.');
            }
        }, 10000);

        // Monitor upload progress
        uploadTask.on('state_changed',
            (snapshot) => {
                clearTimeout(timeoutCheck); // Clear timeout on first progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload progress:', progress + '%');

                document.getElementById('progressBar').style.width = progress + '%';
                document.getElementById('progressText').textContent = `Uploading... ${Math.round(progress)}%`;
                uploadButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Uploading...';
            },
            (error) => {
                clearTimeout(timeoutCheck);
                console.error('Upload error object:', error);

                let errorMessage = 'Upload failed: ' + error.message;

                // Common error handling
                if (error.code === 'storage/unauthorized') {
                    errorMessage = 'Permission Denied: Check your Firebase Storage Rules.';
                } else if (error.code === 'storage/canceled') {
                    errorMessage = 'Upload canceled.';
                } else if (error.code === 'storage/unknown') {
                    errorMessage = 'Unknown error. Check browser console for CORS errors.';
                }

                showUploadError(errorMessage);
                uploadButton.disabled = false;
                uploadButton.innerHTML = '<i class="fa-solid fa-upload mr-2"></i>Upload';
                document.getElementById('uploadProgress').classList.add('hidden');
            },
            async () => {
                clearTimeout(timeoutCheck);
                console.log('Upload complete, getting URL...');

                // Upload completed successfully
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    console.log('Download URL obtained:', downloadURL);

                    // Save metadata to Firestore
                    console.log('Attempting to write to gallery_images collection...');
                    try {
                        const docRef = await db.collection('gallery_images').add({
                            title: title,
                            category: category,
                            description: description,
                            url: downloadURL,
                            fileName: fileName,
                            storagePath: `gallery/${fileName}`,
                            uploadedBy: currentUser.uid,
                            uploadedByEmail: currentUser.email,
                            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            fileSize: file.size,
                            fileType: file.type,
                            active: true
                        });
                        console.log('Metadata saved to Firestore with docId:', docRef.id);
                    } catch (firestoreError) {
                        console.error('Firestore write error (gallery_images collection):', firestoreError);
                        // Show detailed error to user
                        showUploadError(firestoreError);
                        uploadButton.disabled = false;
                        uploadButton.innerHTML = '<i class="fa-solid fa-upload mr-2"></i>Upload';
                        document.getElementById('uploadProgress').classList.add('hidden');
                        return;
                    }

                    // Success!
                    document.getElementById('progressText').textContent = 'Upload complete!';
                    document.getElementById('progressBar').classList.add('bg-green-600');

                    // Close modal and refresh gallery after a short delay
                    setTimeout(() => {
                        closeUploadModal();
                        loadGallery();
                        loadOverviewStats(); // Update stats
                    }, 1000);

                } catch (error) {
                    console.error('Error saving metadata:', error);
                    showUploadError('Upload succeeded but failed to save metadata: ' + error.message);
                    uploadButton.disabled = false;
                    uploadButton.innerHTML = '<i class="fa-solid fa-upload mr-2"></i>Upload';
                }
            }
        );

    } catch (error) {
        console.error('Error initiating upload:', error);
        showUploadError('Failed to start upload: ' + error.message);
        uploadButton.disabled = false;
        uploadButton.innerHTML = '<i class="fa-solid fa-upload mr-2"></i>Upload';
        document.getElementById('uploadProgress').classList.add('hidden');
    }
}

// ==================== EVENTS ====================
async function loadEvents() {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = '<p class="text-gray-500">Loading...</p>';

    try {
        const result = await window.firebaseServices.getUpcomingEvents();

        if (!result.success || result.events.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No events yet</p>';
            return;
        }

        container.innerHTML = '';
        result.events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow p-6';
            card.innerHTML = `
                <h4 class="font-bold text-lg text-gray-900 mb-2">${event.title}</h4>
                <p class="text-sm text-gray-600 mb-4">${event.description}</p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span><i class="fa-solid fa-calendar mr-2"></i>${formatTimestamp(event.eventDate)}</span>
                    <span><i class="fa-solid fa-location-dot mr-2"></i>${event.location}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading events:', error);
        container.innerHTML = '<p class="text-red-500">Error loading events</p>';
    }
}

function createEvent() {
    alert('Create event modal would open here. In production, implement event creation form.');
}

// ==================== UTILITIES ====================
function formatTimestamp(timestamp) {
    if (!timestamp) return '-';

    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return '-';
    }
}

// ==================== DIAGNOSTICS ====================
async function testFirebaseConnection() {
    const statusDiv = document.getElementById('fbStatus');
    const statusText = document.getElementById('fbStatusText');
    if (!statusDiv || !statusText) return;

    statusDiv.classList.remove('hidden');
    statusDiv.querySelector('#fbStatusText').className = 'p-3 rounded-lg bg-yellow-50 text-yellow-800';
    statusText.textContent = 'Checking Firebase connectivity...';

    try {
        // Try a lightweight read from Firestore
        const snapshot = await db.collection('contact_submissions').limit(1).get();
        statusText.textContent = `Connected to Firestore — contact_submissions accessible (documents: ${snapshot.size})`;
        statusText.className = 'p-3 rounded-lg bg-green-50 text-green-800';
    } catch (err) {
        console.error('Firestore connectivity test failed:', err);
        statusText.textContent = 'Firestore read failed: ' + (err && err.message ? err.message : String(err));
        statusText.className = 'p-3 rounded-lg bg-red-50 text-red-800';
    }

    // Quick Storage check (non-destructive): check if storage is defined
    try {
        if (typeof storage === 'undefined' || !storage) {
            const el = document.createElement('div');
            el.textContent = 'Firebase Storage not initialized in this environment.';
            el.className = 'text-sm text-gray-600 mt-1';
            statusDiv.appendChild(el);
        } else {
            const el = document.createElement('div');
            el.textContent = 'Firebase Storage appears available (upload errors may still be due to rules or bucket mismatch).';
            el.className = 'text-sm text-gray-600 mt-1';
            statusDiv.appendChild(el);
        }
    } catch (err) {
        console.warn('Storage check error', err);
    }
}
