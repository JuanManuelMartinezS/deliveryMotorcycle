import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(userProfile?.role);
  };

  return {
    user,
    userProfile,
    loading,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user
  };
}; 