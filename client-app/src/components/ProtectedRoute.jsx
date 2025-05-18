import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile, checkUserRoleData, USER_ROLES } from '../services/authService';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Si no hay roles requeridos, solo verificar autenticación
        if (requiredRoles.length === 0) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Obtener el rol actual del localStorage
        const currentRole = localStorage.getItem('currentRole');
        if (!currentRole) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Verificar si el rol actual está en los roles requeridos
        if (!requiredRoles.includes(currentRole)) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Verificar si el usuario tiene datos para el rol actual
        const userData = await checkUserRoleData(user, currentRole);
        if (!userData) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Agregar listener para cambios en el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkAuth();
    });

    return () => unsubscribe();
  }, [requiredRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 