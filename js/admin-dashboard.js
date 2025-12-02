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
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No messages yet</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-900">${data.name}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${data.email}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${data.message}</td>
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
        const result = await window.firebaseServices.getGalleryImages('all');

        if (!result.success || result.images.length === 0) {
            galleryGrid.innerHTML = '<p class="text-gray-500">No images yet</p>';
            return;
        }

        galleryGrid.innerHTML = '';
        result.images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow overflow-hidden';
            card.innerHTML = `
                <img src="${image.url}" alt="${image.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h4 class="font-bold text-sm text-gray-900 mb-1">${image.title}</h4>
                    <p class="text-xs text-gray-500">${image.category}</p>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p class="text-red-500">Error loading images</p>';
    }
}

function showUploadModal() {
    alert('Image upload modal would open here. In production, implement file upload to Firebase Storage.');
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
