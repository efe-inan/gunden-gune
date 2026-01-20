'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateProfileFirebase,
  User as FirebaseUser
} from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  timeCommitment?: number;
  interests?: string[];
  isOnboarded?: boolean;
  currentDay?: number;
  streak?: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Simple Admin Check (Email Allowlist)
        const ADMIN_EMAILS = ['efe_nbhd@icloud.com'];
        const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');

        // In a real app, we would fetch additional user data from Firestore here
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Kullanıcı',
          isAdmin,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfileFirebase(userCredential.user, {
      displayName: name,
    });
    // Manually update local state to reflect name immediately
    setUser({
      id: userCredential.user.uid,
      email: email,
      name: name,
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    // Placeholder for Firestore update
    // await updateDoc(doc(db, 'users', user!.id), data);
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
