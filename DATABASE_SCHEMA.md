# Plebian Collective - Firebase Database Schema

## Overview
This document defines the complete database schema for the Plebian Collective website using Firebase Firestore.

---

## Collections

### 1. `contact_submissions`
Stores all contact form submissions from the website.

**Fields:**
```javascript
{
  id: string (auto-generated),
  name: string (required),
  email: string (required),
  phone: string (optional),
  message: string (required),
  timestamp: timestamp (auto-generated),
  status: string (enum: 'new', 'read', 'replied', 'archived'),
  repliedAt: timestamp (optional),
  repliedBy: string (optional - admin user ID),
  notes: string (optional - internal notes)
}
```

**Indexes:**
- `status` (ascending)
- `timestamp` (descending)

**Security Rules:**
- Create: Public
- Read/Update/Delete: Admin only

---

### 2. `donations`
Tracks all donation transactions and donor information.

**Fields:**
```javascript
{
  id: string (auto-generated),
  donorName: string (required),
  donorEmail: string (required),
  donorPhone: string (optional),
  donorAddress: string (optional),
  amount: number (required),
  currency: string (default: 'INR'),
  paymentMethod: string (enum: 'online', 'bank_transfer', 'cheque', 'cash'),
  transactionId: string (optional),
  paymentStatus: string (enum: 'pending', 'completed', 'failed', 'refunded'),
  purpose: string (optional - what the donation is for),
  isAnonymous: boolean (default: false),
  taxReceiptRequired: boolean (default: true),
  taxReceiptSent: boolean (default: false),
  timestamp: timestamp (auto-generated),
  completedAt: timestamp (optional),
  notes: string (optional)
}
```

**Indexes:**
- `paymentStatus` (ascending), `timestamp` (descending)
- `donorEmail` (ascending)
- `timestamp` (descending)

**Security Rules:**
- Create: Public
- Read/Update/Delete: Admin only

---

### 3. `newsletter_subscribers`
Manages newsletter subscription list.

**Fields:**
```javascript
{
  id: string (auto-generated),
  email: string (required, unique),
  name: string (optional),
  subscribedAt: timestamp (auto-generated),
  active: boolean (default: true),
  unsubscribedAt: timestamp (optional),
  source: string (optional - which page they subscribed from),
  preferences: {
    frequency: string (enum: 'weekly', 'monthly'),
    topics: array<string> (optional)
  }
}
```

**Indexes:**
- `email` (ascending)
- `active` (ascending)

**Security Rules:**
- Create: Public
- Read/Update/Delete: Admin only

---

### 4. `gallery_images`
Stores gallery images and metadata.

**Fields:**
```javascript
{
  id: string (auto-generated),
  url: string (required - Firebase Storage URL),
  thumbnailUrl: string (optional),
  title: string (required),
  description: string (optional),
  category: string (required, enum: 'community', 'education', 'environment', 'empowerment', 'medical', 'events'),
  tags: array<string> (optional),
  uploadedBy: string (admin user ID),
  uploadedAt: timestamp (auto-generated),
  featured: boolean (default: false),
  displayOrder: number (optional),
  visible: boolean (default: true),
  metadata: {
    width: number,
    height: number,
    size: number (bytes),
    format: string
  }
}
```

**Indexes:**
- `category` (ascending), `uploadedAt` (descending)
- `featured` (ascending), `displayOrder` (ascending)
- `visible` (ascending), `uploadedAt` (descending)

**Security Rules:**
- Read: Public (where visible = true)
- Create/Update/Delete: Admin only

---

### 5. `events`
Manages events and programs organized by the collective.

**Fields:**
```javascript
{
  id: string (auto-generated),
  title: string (required),
  description: string (required),
  shortDescription: string (optional - for cards),
  category: string (enum: 'workshop', 'camp', 'drive', 'seminar', 'fundraiser'),
  eventDate: timestamp (required),
  endDate: timestamp (optional),
  location: string (required),
  address: string (optional),
  coordinates: geopoint (optional),
  maxParticipants: number (optional),
  currentParticipants: number (default: 0),
  registrationOpen: boolean (default: true),
  registrationDeadline: timestamp (optional),
  imageUrl: string (optional),
  organizer: string (optional),
  contactEmail: string (optional),
  contactPhone: string (optional),
  status: string (enum: 'upcoming', 'ongoing', 'completed', 'cancelled'),
  createdAt: timestamp (auto-generated),
  createdBy: string (admin user ID),
  updatedAt: timestamp (auto-generated)
}
```

**Indexes:**
- `status` (ascending), `eventDate` (ascending)
- `category` (ascending), `eventDate` (ascending)
- `eventDate` (ascending)

**Security Rules:**
- Read: Public
- Create/Update/Delete: Admin only

---

### 6. `event_registrations`
Tracks event registrations from users.

**Fields:**
```javascript
{
  id: string (auto-generated),
  eventId: string (required - reference to events collection),
  eventTitle: string (denormalized for quick access),
  name: string (required),
  email: string (required),
  phone: string (required),
  age: number (optional),
  occupation: string (optional),
  organization: string (optional),
  specialRequirements: string (optional),
  registeredAt: timestamp (auto-generated),
  status: string (enum: 'confirmed', 'waitlist', 'cancelled', 'attended'),
  attended: boolean (default: false),
  attendedAt: timestamp (optional),
  cancellationReason: string (optional),
  cancelledAt: timestamp (optional)
}
```

**Indexes:**
- `eventId` (ascending), `status` (ascending)
- `email` (ascending)
- `registeredAt` (descending)

**Security Rules:**
- Create: Public
- Read/Update/Delete: Admin only

---

### 7. `volunteers`
Manages volunteer information and applications.

**Fields:**
```javascript
{
  id: string (auto-generated),
  name: string (required),
  email: string (required),
  phone: string (required),
  dateOfBirth: timestamp (optional),
  address: string (optional),
  city: string (optional),
  state: string (optional),
  pincode: string (optional),
  occupation: string (optional),
  skills: array<string> (optional),
  interests: array<string> (optional),
  availability: string (enum: 'weekdays', 'weekends', 'both', 'flexible'),
  hoursPerWeek: number (optional),
  experience: string (optional),
  motivation: string (optional),
  appliedAt: timestamp (auto-generated),
  status: string (enum: 'pending', 'approved', 'rejected', 'inactive'),
  approvedAt: timestamp (optional),
  approvedBy: string (optional - admin user ID),
  totalHours: number (default: 0),
  lastActiveAt: timestamp (optional)
}
```

**Indexes:**
- `status` (ascending)
- `email` (ascending)
- `appliedAt` (descending)

**Security Rules:**
- Create: Public
- Read/Update/Delete: Admin only

---

### 8. `programs`
Stores information about ongoing programs and initiatives.

**Fields:**
```javascript
{
  id: string (auto-generated),
  title: string (required),
  description: string (required),
  category: string (enum: 'employment', 'education', 'environment', 'elderly', 'legal', 'relief'),
  status: string (enum: 'active', 'completed', 'planned', 'paused'),
  startDate: timestamp (required),
  endDate: timestamp (optional),
  budget: number (optional),
  spent: number (default: 0),
  beneficiaries: number (default: 0),
  targetBeneficiaries: number (optional),
  location: string (optional),
  partners: array<string> (optional),
  imageUrl: string (optional),
  documents: array<{
    name: string,
    url: string,
    type: string
  }> (optional),
  createdAt: timestamp (auto-generated),
  createdBy: string (admin user ID),
  updatedAt: timestamp (auto-generated)
}
```

**Indexes:**
- `status` (ascending), `startDate` (descending)
- `category` (ascending)

**Security Rules:**
- Read: Public
- Create/Update/Delete: Admin only

---

### 9. `admin_users`
Manages admin user accounts and permissions.

**Fields:**
```javascript
{
  id: string (Firebase Auth UID),
  email: string (required),
  name: string (required),
  role: string (enum: 'super_admin', 'admin', 'editor', 'viewer'),
  permissions: array<string> (optional),
  active: boolean (default: true),
  createdAt: timestamp (auto-generated),
  createdBy: string (optional),
  lastLoginAt: timestamp (optional),
  profileImageUrl: string (optional)
}
```

**Indexes:**
- `email` (ascending)
- `role` (ascending)
- `active` (ascending)

**Security Rules:**
- Read/Write: Super Admin only

---

### 10. `site_settings`
Stores website configuration and settings.

**Fields:**
```javascript
{
  id: string (document ID: 'global'),
  organizationName: string,
  tagline: string,
  description: string,
  contactEmail: string,
  contactPhone: string,
  address: string,
  socialMedia: {
    facebook: string,
    twitter: string,
    instagram: string,
    linkedin: string,
    youtube: string
  },
  donationGoal: number (optional),
  currentDonations: number (auto-calculated),
  bankDetails: {
    accountName: string,
    accountNumber: string,
    ifscCode: string,
    bankName: string,
    branch: string
  },
  upiId: string (optional),
  registrationNumber: string,
  panNumber: string,
  taxExemption: {
    section: string,
    certificateUrl: string
  },
  updatedAt: timestamp,
  updatedBy: string
}
```

**Security Rules:**
- Read: Public
- Write: Admin only

---

### 11. `analytics_events`
Stores custom analytics events for tracking.

**Fields:**
```javascript
{
  id: string (auto-generated),
  eventType: string (required),
  eventData: object (optional),
  userId: string (optional),
  sessionId: string (optional),
  timestamp: timestamp (auto-generated),
  page: string (optional),
  userAgent: string (optional),
  ipAddress: string (optional - hashed for privacy)
}
```

**Indexes:**
- `eventType` (ascending), `timestamp` (descending)
- `timestamp` (descending)

**Security Rules:**
- Create: Public (limited fields)
- Read/Delete: Admin only

---

## Relationships

```
events (1) ←→ (many) event_registrations
programs (1) ←→ (many) volunteers (through assignment)
admin_users (1) ←→ (many) gallery_images (uploadedBy)
admin_users (1) ←→ (many) events (createdBy)
```

---

## Data Aggregation

### Computed Fields (Cloud Functions)
- `donations.total` - Sum of all completed donations
- `events.currentParticipants` - Count of confirmed registrations
- `programs.spent` - Sum of expenses
- `site_settings.currentDonations` - Real-time donation total

---

## Backup Strategy

1. **Daily Backups**: Automated Firestore export to Cloud Storage
2. **Retention**: 30 days of daily backups
3. **Critical Collections**: contact_submissions, donations, volunteers

---

## Migration Notes

- All timestamps use Firestore server timestamp
- Enums are enforced at application level
- Denormalized fields (e.g., eventTitle in registrations) for performance
- Soft deletes preferred over hard deletes for audit trail

---

**Last Updated:** December 2, 2025
**Version:** 1.0
