// Example: Contact Form Integration with Firebase
// This file shows how to integrate the contact form with Firebase

document.addEventListener('DOMContentLoaded', function () {
    // Get all contact forms on the page
    const contactForms = document.querySelectorAll('form[onsubmit*="contact"]');

    contactForms.forEach(form => {
        // Remove the default onsubmit handler
        form.removeAttribute('onsubmit');

        // Add new Firebase-powered submit handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: form.querySelector('input[type="text"]')?.value || '',
                email: form.querySelector('input[type="email"]')?.value || '',
                message: form.querySelector('textarea')?.value || ''
            };

            // Validate form data
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all fields');
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Submit to Firebase
                const result = await window.firebaseServices.submitContactForm(formData);

                if (result.success) {
                    // Success message
                    alert('Thank you for your message! We will get back to you soon.');
                    form.reset();

                    // Log analytics event
                    if (window.firebaseServices.logPageView) {
                        window.analytics?.logEvent('contact_form_submitted');
                    }
                } else {
                    throw new Error(result.error || 'Failed to submit form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Sorry, there was an error submitting your message. Please try again.');
            } finally {
                // Restore button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    });
});

// Example: Newsletter Subscription
function setupNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const nameInput = form.querySelector('input[type="text"]');

            const email = emailInput?.value || '';
            const name = nameInput?.value || '';

            if (!email) {
                alert('Please enter your email address');
                return;
            }

            try {
                const result = await window.firebaseServices.subscribeToNewsletter(email, name);

                if (result.success) {
                    alert('Thank you for subscribing to our newsletter!');
                    form.reset();
                } else {
                    if (result.error === 'Email already subscribed') {
                        alert('This email is already subscribed to our newsletter.');
                    } else {
                        throw new Error(result.error);
                    }
                }
            } catch (error) {
                console.error('Error subscribing:', error);
                alert('Sorry, there was an error. Please try again.');
            }
        });
    });
}

// Example: Donation Tracking
async function handleDonation(donationData) {
    try {
        // Log donation click for analytics
        window.firebaseServices.logDonationClick(donationData.amount);

        // Record donation in database
        const result = await window.firebaseServices.recordDonation(donationData);

        if (result.success) {
            console.log('Donation recorded:', result.id);
            // Redirect to payment gateway or show success message
            return result.id;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error recording donation:', error);
        alert('Sorry, there was an error processing your donation.');
        return null;
    }
}

// Example: Display Total Donations
async function displayTotalDonations() {
    const donationCounterElement = document.getElementById('donation-counter');

    if (donationCounterElement) {
        try {
            const result = await window.firebaseServices.getTotalDonations();

            if (result.success) {
                // Format the total amount
                const formattedTotal = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                }).format(result.total);

                donationCounterElement.textContent = formattedTotal;

                // Optionally show donor count
                const donorCountElement = document.getElementById('donor-count');
                if (donorCountElement) {
                    donorCountElement.textContent = result.count;
                }
            }
        } catch (error) {
            console.error('Error displaying donations:', error);
        }
    }
}

// Example: Load Gallery Images from Firebase
async function loadGalleryFromFirebase(category = 'all') {
    const galleryContainer = document.querySelector('.gallery-grid');

    if (!galleryContainer) return;

    try {
        const result = await window.firebaseServices.getGalleryImages(category);

        if (result.success && result.images.length > 0) {
            // Clear existing gallery
            galleryContainer.innerHTML = '';

            // Add images from Firebase
            result.images.forEach((image, index) => {
                const imageCard = createGalleryCard(image, index);
                galleryContainer.appendChild(imageCard);
            });
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function createGalleryCard(image, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item group relative overflow-hidden rounded-xl shadow-lg cursor-pointer';
    div.setAttribute('data-category', image.category);
    div.setAttribute('data-index', index);

    div.innerHTML = `
        <img src="${image.url}" alt="${image.title}" 
             class="w-full h-64 object-cover transition duration-500 group-hover:scale-110">
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
            <div class="text-center text-white">
                <i class="fa-solid fa-search-plus text-3xl mb-2"></i>
                <p class="font-bold">${image.title}</p>
            </div>
        </div>
    `;

    return div;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Setup newsletter forms if they exist
    setupNewsletterForm();

    // Display total donations if element exists
    displayTotalDonations();

    // Log page view
    const pageName = document.title || 'Unknown Page';
    window.firebaseServices?.logPageView(pageName);
}
