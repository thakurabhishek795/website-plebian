// Simple Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 10) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
});

// ==================== CONTACT FORM WITH FIREBASE ====================
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form elements
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const phoneInput = document.getElementById('contactPhone');
            const messageInput = document.getElementById('contactMessage');
            const submitButton = document.getElementById('contactSubmit');
            const messageDiv = document.getElementById('contactFormMessage');

            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                showMessage(messageDiv, 'Please fill in all required fields', 'error');
                return;
            }

            // Show loading state
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            messageDiv.classList.add('hidden');

            try {
                // Check if Firebase is initialized
                if (typeof window.firebaseServices === 'undefined') {
                    throw new Error('Firebase not initialized. Please check your configuration.');
                }

                // Submit to Firebase
                const result = await window.firebaseServices.submitContactForm(formData);

                if (result.success) {
                    // Success
                    showMessage(messageDiv, 'Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                    contactForm.reset();

                    // Log analytics event
                    if (window.analytics) {
                        window.analytics.logEvent('contact_form_submitted', {
                            page: 'main'
                        });
                    }
                } else {
                    throw new Error(result.error || 'Failed to submit form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showMessage(messageDiv, 'Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            } finally {
                // Restore button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Log page view
    if (window.firebaseServices && window.firebaseServices.logPageView) {
        window.firebaseServices.logPageView('Home Page');
    }
});

// Helper function to show messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.classList.remove('hidden', 'text-green-400', 'text-red-400');
    element.classList.add(type === 'success' ? 'text-green-400' : 'text-red-400');

    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }
}
