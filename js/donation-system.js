// Donation Tracking System with Firebase Integration

document.addEventListener('DOMContentLoaded', function () {
    initializeDonationForm();
    loadDonationStats();
});

// ==================== DONATION FORM ====================
function initializeDonationForm() {
    const donationForm = document.getElementById('donationForm');
    if (!donationForm) return;

    // Amount selection buttons
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    let selectedAmount = 1000; // Default

    amountButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            amountButtons.forEach(b => {
                b.classList.remove('border-brand-600', 'bg-brand-50');
                b.classList.add('border-brand-100');
            });

            // Add active class to clicked button
            this.classList.add('border-brand-600', 'bg-brand-50');
            this.classList.remove('border-brand-100');

            // Set selected amount
            selectedAmount = parseInt(this.dataset.amount);
            customAmountInput.value = '';
        });
    });

    // Custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function () {
            if (this.value) {
                selectedAmount = parseInt(this.value) || 0;
                // Deselect all buttons
                amountButtons.forEach(b => {
                    b.classList.remove('border-brand-600', 'bg-brand-50');
                    b.classList.add('border-brand-100');
                });
            }
        });
    }

    // Form submission
    donationForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            amount: selectedAmount,
            name: document.getElementById('donorName').value.trim(),
            email: document.getElementById('donorEmail').value.trim(),
            phone: document.getElementById('donorPhone').value.trim(),
            pan: document.getElementById('donorPAN').value.trim(),
            paymentMethod: 'online'
        };

        // Validate
        if (!formData.amount || formData.amount < 100) {
            showDonationMessage('Please select or enter an amount (minimum ₹100)', 'error');
            return;
        }

        if (!formData.name || !formData.email || !formData.phone) {
            showDonationMessage('Please fill in all required fields', 'error');
            return;
        }

        // Show loading
        const submitButton = document.getElementById('donationSubmit');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        try {
            // Check if Firebase is initialized
            if (typeof window.firebaseServices === 'undefined') {
                throw new Error('Firebase not initialized');
            }

            // Record donation in Firebase
            const result = await window.firebaseServices.recordDonation(formData);

            if (result.success) {
                // Log analytics
                window.firebaseServices.logDonationClick(formData.amount);

                // Show success message
                showDonationMessage(
                    `Thank you for your generous donation of ₹${formData.amount}! Redirecting to payment gateway...`,
                    'success'
                );

                // In a real implementation, redirect to payment gateway
                setTimeout(() => {
                    // window.location.href = '/payment?id=' + result.id;
                    alert(`Donation ID: ${result.id}\n\nIn production, you would be redirected to a payment gateway like Razorpay or PayU.`);
                    donationForm.reset();
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, 2000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error recording donation:', error);
            showDonationMessage('Sorry, there was an error processing your donation. Please try again.', 'error');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

// ==================== DONATION STATISTICS ====================
async function loadDonationStats() {
    try {
        if (typeof window.firebaseServices === 'undefined') return;

        const result = await window.firebaseServices.getTotalDonations();

        if (result.success) {
            // Update total donations display
            const totalElement = document.getElementById('totalDonations');
            if (totalElement) {
                const formatted = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                }).format(result.total);
                totalElement.textContent = formatted;
            }

            // Update donor count
            const countElement = document.getElementById('donorCount');
            if (countElement) {
                countElement.textContent = result.count;
            }

            // Calculate progress if goal exists
            const goalElement = document.getElementById('donationGoal');
            const progressBar = document.getElementById('donationProgress');
            if (goalElement && progressBar) {
                const goal = parseInt(goalElement.dataset.goal) || 1000000;
                const progress = Math.min((result.total / goal) * 100, 100);
                progressBar.style.width = progress + '%';
            }
        }
    } catch (error) {
        console.error('Error loading donation stats:', error);
    }
}

// Helper function to show donation messages
function showDonationMessage(message, type) {
    const messageDiv = document.getElementById('donationFormMessage');
    if (!messageDiv) {
        alert(message);
        return;
    }

    messageDiv.textContent = message;
    messageDiv.classList.remove('hidden', 'text-green-600', 'text-red-600', 'bg-green-50', 'bg-red-50');

    if (type === 'success') {
        messageDiv.classList.add('text-green-600', 'bg-green-50');
    } else {
        messageDiv.classList.add('text-red-600', 'bg-red-50');
    }

    messageDiv.classList.add('p-4', 'rounded-lg', 'mb-4');

    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}

// Export for use in other files
window.donationSystem = {
    loadDonationStats,
    showDonationMessage
};
