import React, { useCallback, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

import type { User } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

import {
  AuthContext,
  type UserProfile,
} from "./AuthContext";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return;
    }

    try {
      const docRef = doc(db, "users", auth.currentUser.uid);

      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        setProfile(null);
        return;
      }

      const data = snapshot.data();

      setProfile({
        uid: auth.currentUser.uid,
        email: data.email ?? "",
        displayName: data.displayName ?? "",
        role: data.role ?? "user",
        status: data.status ?? "active",
        lastLogin: data.lastLogin,
      });
    } catch (err) {
      console.error(getFirebaseErrorMessage(err));
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);

      setUser(firebaseUser);

      if (firebaseUser) {
        await refreshProfile();
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [refreshProfile]);

  const handleSignOut = async () => {
    await signOut(auth);

    setProfile(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;