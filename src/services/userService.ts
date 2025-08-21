import { db, auth } from '../firebase/firebaseConfig';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  deleteUser as deleteAuthUser,
  updatePassword as updateAuthPassword
} from 'firebase/auth';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date | null;
  createdAt: Date;
}

export interface UserFormData {
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'moderator';
  password: string;
  status: 'active' | 'inactive' | 'suspended';
}

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email,
          displayName: data.displayName,
          role: data.role,
          status: data.status,
          lastLogin: data.lastLogin ? data.lastLogin.toDate() : null,
          createdAt: data.createdAt.toDate()
        } as User;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Get single user
  getUser: async (uid: string): Promise<User> => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const data = userDoc.data();
      return {
        uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        status: data.status,
        lastLogin: data.lastLogin ? data.lastLogin.toDate() : null,
        createdAt: data.createdAt.toDate()
      } as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  },

  // Create user
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
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
        status: userData.status,
        createdAt: new Date(),
        lastLogin: null
      };
      
      await setDoc(userRef, userDoc);
      return { uid: userCredential.user.uid, ...userDoc } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  // Update user
  updateUser: async (uid: string, updates: Partial<User>): Promise<void> => {
    try {
      const userRef = doc(db, 'users', uid);
      const updateData: Partial<User> & { lastLogin?: Date | null; createdAt?: Date } = { ...updates };
      if (updates.lastLogin) {
        updateData.lastLogin = updates.lastLogin;
      }
      if (updates.createdAt) {
        updateData.createdAt = updates.createdAt;
      }
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },

  // Update user password
  updatePassword: async (newPassword: string): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      await updateAuthPassword(user, newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  },

  // Delete user

  // Delete user
  deleteUser: async (uid: string): Promise<void> => {
    try {
      // Delete auth user if it's the current user
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === uid) {
        await deleteAuthUser(currentUser);
      }
      
      // Delete user document
      const userRef = doc(db, 'users', uid);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
};