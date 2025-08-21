# Technical Specification: Settings and User Management Pages

## 1. Settings Page

### 1.1 Component Structure
File: `src/components/settings/Settings.tsx`

### 1.2 State Management
```typescript
interface SettingsState {
  general: {
    appName: string;
    language: string;
    timezone: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
}
```

### 1.3 Firebase Integration
- Store settings in Firestore under `/settings/{userId}` or `/appSettings`
- Use `onSnapshot` for real-time updates
- Implement save functionality with `setDoc` or `updateDoc`

### 1.4 UI Components
- Card-based layout for different setting categories
- Form inputs for text settings
- Toggle switches for boolean settings
- Dropdown selectors for enum settings
- Save button with loading state

## 2. User Management Page

### 2.1 Component Structure
File: `src/components/users/UserManagement.tsx`

### 2.2 Data Models
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
}

interface UserFormData {
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'moderator';
  password: string; // Only for creation
}
```

### 2.3 Firebase Integration
Functions needed in `userService.ts`:
- `getUsers(): Promise<User[]>` - Fetch all users
- `getUser(uid: string): Promise<User>` - Fetch single user
- `createUser(userData: UserFormData): Promise<User>` - Create new user
- `updateUser(uid: string, updates: Partial<User>): Promise<void>` - Update user
- `deleteUser(uid: string): Promise<void>` - Delete user

### 2.4 UI Components
- Searchable and sortable data table
- User creation modal
- User edit modal
- Delete confirmation dialog
- User status badges
- Action buttons (edit, delete)

## 3. Service Layer

### 3.1 User Service
File: `src/services/userService.ts`

Key functions:
```typescript
import { db, auth } from '../firebase/firebaseConfig';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as User[];
  },

  // Get single user
  getUser: async (uid: string): Promise<User> => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { uid, ...userDoc.data() } as User;
  },

  // Create user
  createUser: async (userData: UserFormData): Promise<User> => {
    // Create auth user first
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    // Then create user document
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = {
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      status: 'active',
      createdAt: new Date(),
      lastLogin: null
    };
    
    await setDoc(userRef, userDoc);
    return { uid: userCredential.user.uid, ...userDoc } as User;
  },

  // Update user
  updateUser: async (uid: string, updates: Partial<User>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
  },

  // Delete user
  deleteUser: async (uid: string): Promise<void> => {
    // Delete auth user
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await deleteAuthUser(user);
    }
    
    // Delete user document
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  }
};
```

## 4. Routing Updates

### 4.1 App.tsx Changes
Replace placeholder routes with actual components:

```typescript
// Import new components
import Settings from "./components/settings/Settings";
import UserManagement from "./components/users/UserManagement";

// Update routes
<Route path="/users" element={
  <ProtectedRoute>
    <Layout title="Gestion des utilisateurs">
      <UserManagement />
    </Layout>
  </ProtectedRoute>
} />

<Route path="/settings" element={
  <ProtectedRoute>
    <Layout title="Paramètres">
      <Settings />
    </Layout>
  </ProtectedRoute>
} />
```

## 5. Dependencies

### 5.1 Required Packages
- `@heroicons/react` (already installed)
- `firebase` (already installed)

### 5.2 Optional Enhancements
- `react-hook-form` for form validation
- `react-toastify` for notifications
- `date-fns` for date formatting

## 6. Error Handling

### 6.1 Common Error Scenarios
- Network errors when fetching data
- Permission errors when updating/deleting users
- Validation errors in forms
- User not found errors

### 6.2 Error Handling Strategy
- Display user-friendly error messages
- Implement retry mechanisms for network errors
- Log errors to console for debugging
- Prevent destructive actions without confirmation

## 7. Performance Considerations

### 7.1 Optimization Techniques
- Implement pagination for user lists
- Use React.memo for components
- Implement loading states for better UX
- Cache frequently accessed data
- Use Firestore listeners for real-time updates

## 8. Security Considerations

### 8.1 Access Control
- Only admin users should access user management
- Implement role-based access control
- Validate all inputs on both client and server
- Sanitize user inputs to prevent XSS attacks

### 8.2 Data Protection
- Never expose user passwords
- Use HTTPS in production
- Implement proper authentication checks
- Log security-relevant actions