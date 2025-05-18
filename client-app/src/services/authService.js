import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');


// Constantes de roles
export const USER_ROLES = {
  CUSTOMER: 'customers',
  RESTAURANT: 'restaurants',
  DRIVER: 'drivers'
};

// Función para iniciar sesión con email/contraseña
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await firebaseSignIn(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

// Función para iniciar sesión con GitHub
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con GitHub:", error);
    throw error;
  }
};

export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Microsoft:", error);
    throw error;
  }
}


// Función para cerrar sesión
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

// Función para verificar si un usuario tiene datos para un rol específico
export const checkUserRoleData = async (user, role) => {
  if (!user || !role) {
    console.error('Usuario o rol no proporcionado');
    return null;
  }

  try {

    const idToken = await user.getIdToken();
    
    const response = await fetch(`${API_URL}/${role}?email=${encodeURIComponent(user.email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });

    // Si el endpoint no existe o hay un error de servidor
    if (response.status === 404 || response.status === 500) {
      console.log(`Error en el endpoint ${role}:`, response.status);
      return null;
    }

    // Si hay un error de red o CORS
    if (!response.ok) {
      console.error(`Error checking ${role} data:`, response.status);
      return null;
    }

    const users = await response.json();

    // Verificamos si el array está vacío o si no hay coincidencia exacta del email
    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    // Buscamos una coincidencia exacta del email
    const userData = users.find(u => u.email === user.email);
    if (!userData) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error(`Error checking ${role} data:`, error);
    return null;
  }
};

// Función para obtener los roles del usuario
export const getUserRoles = async (user) => {
  if (!user) return [];
  
  try {
    const roles = [];
    
    // Verificar rol de cliente
    try {
      const customerData = await checkUserRoleData(user, USER_ROLES.CUSTOMER);
      if (customerData) roles.push(USER_ROLES.CUSTOMER);
    } catch (error) {
      console.log('Usuario no es cliente:', error.message);
    }

    // Verificar rol de restaurante
    try {
      const restaurantData = await checkUserRoleData(user, USER_ROLES.RESTAURANT);
      if (restaurantData) roles.push(USER_ROLES.RESTAURANT);
    } catch (error) {
      console.log('Usuario no es restaurante:', error.message);
    }

    // Verificar rol de conductor
    try {
      const driverData = await checkUserRoleData(user, USER_ROLES.DRIVER);
      if (driverData) roles.push(USER_ROLES.DRIVER);
    } catch (error) {
      console.log('Usuario no es conductor:', error.message);
    }

    return roles;
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return [];
  }
};

// Función para guardar datos del usuario en el backend
export const saveUserData = async (user, additionalData = null) => {
  if (!user) return null;
  
  try {
    const idToken = await user.getIdToken();
    const userType = additionalData?.userType;
    
    if (!userType) {
      throw new Error('Tipo de usuario no seleccionado');
    }

    // Verificar si el usuario ya tiene datos para este rol
    const existingData = await checkUserRoleData(user, userType);
    if (existingData) {
      return { ...existingData, userType };
    }

    // Preparar los datos básicos del usuario
    const userData = {
      name: user.displayName || "Usuario",
      email: user.email,
      phone: user.phoneNumber || "0000000000"
    };

    // Agregar campos específicos según el tipo de usuario
    if (userType === USER_ROLES.DRIVER) {
      userData.license_number = additionalData.license_number || "PENDIENTE";
      userData.status = 'available';
    } else if (userType === USER_ROLES.RESTAURANT) {
      userData.address = additionalData.address || "PENDIENTE";
      userData.description = additionalData.description || "";
    } else if (userType === USER_ROLES.CUSTOMER) {
      userData.address = additionalData.address || "PENDIENTE";
    }

    // Crear nuevo usuario
    const response = await fetch(`${API_URL}/${userType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData),
      mode: 'cors'
    });

    if (!response.ok) {
      let errorMessage = `Error al crear usuario: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const newUser = await response.json();
    return { ...newUser, userType };
  } catch (error) {
    console.error("Error al guardar datos del usuario:", error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Por favor, verifique que el servidor esté en ejecución.');
    }
    throw error;
  }
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Observer para cambios en el estado de autenticación
export const authStateObserver = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Función para obtener el token de acceso actual
export const getAccessToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
};

export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Función para obtener el perfil completo del usuario
export const getUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const idToken = await user.getIdToken();
    const roles = await getUserRoles(user);
    
    if (roles.length === 0) {
      return null;
    }

    // Obtener datos del rol actual
    const currentRole = localStorage.getItem('currentRole') || roles[0];
    const userData = await checkUserRoleData(user, currentRole);
    
    if (!userData) {
      return null;
    }

    return {
      ...userData,
      roles,
      currentRole
    };
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    return null;
  }
};

// Función para cambiar el rol actual del usuario
export const changeUserRole = async (newRole) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No hay usuario autenticado');

  const userData = await checkUserRoleData(user, newRole);
  if (!userData) {
    throw new Error('No tienes datos registrados para este rol');
  }

  localStorage.setItem('currentRole', newRole);
  return userData;
};