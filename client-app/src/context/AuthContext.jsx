// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { authStateObserver, getUserProfile } from '../services/authService';
import { logOut } from '../services/authService';

// Creación del contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const updateUserProfile = async (user) => {
    try {
      if (!user) {
        setUserProfile(null);
        return;
      }

      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setUserProfile(null);
    }
  };

  const logout = async () => {
    try {
      await logOut();
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('currentRole');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = async () => {
      try {
        unsubscribe = authStateObserver(async (user) => {
          setCurrentUser(user);
          if (user) {
            await updateUserProfile(user);
          } else {
            setUserProfile(null);
          }
          if (!initialized) {
            setInitialized(true);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error al inicializar auth:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initialized]);

  // Valor a proporcionar en el contexto
  const value = {
    currentUser,
    userProfile,
    loading: loading || !initialized,
    updateUserProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;