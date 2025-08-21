# Settings and User Management Pages Implementation Plan

## Overview
This document outlines the implementation plan for creating two new pages in the backoffice-declaration application:
1. Settings page (Paramètres)
2. User Management page (Gestion des utilisateurs)

## Current State Analysis
From examining the codebase, I found:
- The routes for `/settings` and `/users` already exist in `App.tsx` but currently display placeholder content
- The sidebar navigation already includes menu items for both pages
- Firebase authentication is implemented via AuthContext
- The application uses a component-based structure with Layout, Header, and Sidebar components

## Implementation Steps

### 1. Settings Page Implementation

#### File to Create:
`src/components/settings/Settings.tsx`

#### Component Structure:
- General settings (application name, theme preferences)
- Notification settings
- Security settings
- Profile settings

#### Features to Implement:
- Form for updating application settings
- Toggle switches for notification preferences
- Password change functionality
- Profile information update

### 2. User Management Page Implementation

#### File to Create:
`src/components/users/UserManagement.tsx`

#### Component Structure:
- User list table with search and filtering
- User detail view/edit modal
- User creation form
- User deletion functionality

#### Features to Implement:
- Display list of all users with key information (name, email, role, status)
- Filter and search functionality
- Edit user details (role, permissions, status)
- Create new users
- Delete users (with confirmation)
- View user activity logs

### 3. Route Updates

#### File to Modify:
`src/App.tsx`

#### Changes Required:
- Replace placeholder content for `/settings` route with Settings component
- Replace placeholder content for `/users` route with UserManagement component

### 4. Firebase Integration

#### Services to Create:
- `src/services/userService.ts` - for user management operations
- Extend `src/services/declarationService.ts` if needed for any additional settings

#### Functions Needed:
- Fetch all users
- Create new user
- Update user information
- Delete user
- Update application settings

## Component Structure

### Settings Component (`Settings.tsx`)
```tsx
import React, { useState } from 'react';

const Settings: React.FC = () => {
  // State for settings
  const [settings, setSettings] = useState({
    appName: 'BackOffice Déclaration',
    notifications: true,
    theme: 'light',
    // Add more settings as needed
  });

  const handleSave = () => {
    // Save settings logic
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres généraux</h2>
        {/* Settings form */}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sécurité</h2>
        {/* Security settings */}
      </div>
    </div>
  );
};

export default Settings;
```

### User Management Component (`UserManagement.tsx`)
```tsx
import React, { useState, useEffect } from 'react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Ajouter un utilisateur
        </button>
      </div>
      
      {/* User table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Table content */}
      </div>
    </div>
  );
};

export default UserManagement;
```

## Next Steps

1. Switch to Code mode to implement the actual components
2. Create the Settings component with basic functionality
3. Create the User Management component with user listing
4. Implement Firebase integration for user operations
5. Update routing in App.tsx to use the new components
6. Test the implementation thoroughly

## Files to Create
1. `src/components/settings/Settings.tsx`
2. `src/components/users/UserManagement.tsx`
3. `src/services/userService.ts`

## Files to Modify
1. `src/App.tsx` - Update routes to use new components