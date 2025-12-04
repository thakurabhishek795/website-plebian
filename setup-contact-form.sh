#!/bin/bash

# Contact Form Database Setup Script
# This script helps deploy Firestore security rules to enable the contact form

echo "============================================"
echo "  Contact Form Database Setup"
echo "============================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo ""
    echo "Would you like to install it? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "📦 Installing Firebase CLI..."
        npm install -g firebase-tools
        
        if [ $? -eq 0 ]; then
            echo "✅ Firebase CLI installed successfully!"
        else
            echo "❌ Failed to install Firebase CLI"
            echo "Please install it manually: npm install -g firebase-tools"
            exit 1
        fi
    else
        echo ""
        echo "⚠️  Please install Firebase CLI manually:"
        echo "   npm install -g firebase-tools"
        echo ""
        echo "OR deploy rules manually via Firebase Console:"
        echo "   https://console.firebase.google.com/"
        exit 0
    fi
fi

echo ""
echo "✅ Firebase CLI is installed"
echo ""

# Check if logged in
echo "🔐 Checking Firebase authentication..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "Please login to Firebase:"
    firebase login
    
    if [ $? -ne 0 ]; then
        echo "❌ Login failed"
        exit 1
    fi
fi

echo "✅ Authenticated with Firebase"
echo ""

# List available projects
echo "📋 Available Firebase projects:"
firebase projects:list

echo ""
echo "🎯 Your project: website-plebian"
echo ""

# Deploy Firestore rules
echo "📤 Deploying Firestore security rules..."
echo ""

firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================"
    echo "  ✅ SUCCESS!"
    echo "============================================"
    echo ""
    echo "Firestore security rules have been deployed!"
    echo ""
    echo "Next steps:"
    echo "1. Open Main.html in your browser"
    echo "2. Scroll to the contact form"
    echo "3. Test submitting a message"
    echo ""
    echo "To verify submissions:"
    echo "- Open: https://console.firebase.google.com/"
    echo "- Navigate to Firestore Database"
    echo "- Check the 'contact_submissions' collection"
    echo ""
else
    echo ""
    echo "============================================"
    echo "  ❌ DEPLOYMENT FAILED"
    echo "============================================"
    echo ""
    echo "Manual deployment steps:"
    echo "1. Go to: https://console.firebase.google.com/"
    echo "2. Select project: website-plebian"
    echo "3. Go to Firestore Database > Rules"
    echo "4. Copy content from: firestore.rules"
    echo "5. Click Publish"
    echo ""
fi
