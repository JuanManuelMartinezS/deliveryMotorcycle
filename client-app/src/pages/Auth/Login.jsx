import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithGoogle, 
  signInWithGitHub,
  signInWithMicrosoft,
  saveUserData, 
  checkUserRoleData, 
  USER_ROLES 
} from '../../services/authService';
import { auth } from '../../firebase/firebaseConfig';
import RoleRegistrationModal from '../../components/RoleRegistrationModal';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar sesión solo al cargar el componente
  useEffect(() => {
    const checkSession = async () => {
      const user = auth.currentUser;
      if (user) {
        const currentRole = localStorage.getItem('currentRole');
        if (currentRole) {
          try {
            const hasData = await checkUserRoleData(user, currentRole);
            if (hasData) {
              navigate(`/${currentRole}`);
            } else {
              setCurrentUser(user);
              setUserType(currentRole);
              setShowRegistrationModal(true);
            }
          } catch (error) {
            console.error('Error verificando datos:', error);
            setError('Error al verificar datos del usuario');
          }
        }
      }
    };
    checkSession();
  }, [navigate]);

  // Función para verificar datos del usuario
  const verifyUserData = async (user, selectedUserType) => {
    try {
      const userData = await checkUserRoleData(user, selectedUserType);
      if (!userData) {
        setCurrentUser(user);
        setShowRegistrationModal(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verificando datos del usuario:', error);
      setError('Error al verificar datos del usuario');
      return false;
    }
  };

  // Helper function for social login
  const handleSocialLogin = async (loginFunction) => {
    try {
      if (!userType) {
        throw new Error('Por favor selecciona un tipo de usuario');
      }

      setLoading(true);
      setError('');
      
      const user = await loginFunction();
      
      const hasData = await verifyUserData(user, userType);
      
      if (!hasData) {
        return;
      }

      localStorage.setItem('currentRole', userType);
      navigate(`/${userType}`);
    } catch (error) {
      console.error('Error en login social:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!userType) {
        throw new Error('Por favor selecciona un tipo de usuario');
      }

      const user = await signInWithEmailAndPassword(email, password);
      
      const hasData = await verifyUserData(user, userType);
      
      if (!hasData) {
        return;
      }

      localStorage.setItem('currentRole', userType);
      navigate(`/${userType}`);
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => handleSocialLogin(signInWithGoogle);
  const handleGitHubLogin = () => handleSocialLogin(signInWithGitHub);
  const handleMicrosoftLogin = () => handleSocialLogin(signInWithMicrosoft);

  // eslint-disable-next-line no-unused-vars
  const handleRegistrationComplete = async (_userData) => {
    try {
      localStorage.setItem('currentRole', userType);
      navigate(`/${userType}`);
    } catch (error) {
      console.error('Error al completar registro:', error);
      setError(error.message);
    }
  };

    return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Exotic Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        {/* Animated shapes */}
        <div className="absolute w-64 h-64 bg-red-600 rounded-full top-1/4 -left-10 animate-floating"></div>
        <div className="absolute w-40 h-40 bg-blue-700 rounded-sm bottom-1/3 right-10 animate-spin-slow"></div>
        <div className="absolute w-32 h-32 bg-red-700 rotate-45 top-2/3 left-1/3 animate-bounce-slow"></div>
        <div className="absolute w-80 h-80 bg-blue-900 -rotate-12 bottom-0 -right-20 animate-pulse-slow"></div>
        <div className="absolute w-20 h-20 bg-blue-500 rounded-full top-20 right-1/4 animate-ping-slow"></div>
        <div className="absolute w-40 h-40 bg-red-500 top-1/3 left-1/4 transform skew-x-12 animate-skew"></div>
        {/* Overlay with blur */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-black/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-red-500/50 text-white z-10">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Inicia sesión</h1>
            <p className="text-gray-300">Ingresa a tu cuenta para continuar</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-500 rounded-lg text-white font-medium bg-black/50 hover:bg-red-900/30 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            <button
              onClick={handleGitHubLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-blue-500 rounded-lg text-white font-medium bg-black/50 hover:bg-blue-900/30 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#ffffff"/>
              </svg>
              Continuar con GitHub
            </button>

            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-500 border-r-blue-500 border-t-blue-500 border-l-red-500 rounded-lg text-white font-medium bg-black/50 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 11H0V0h11v11z" fill="#F25022"/>
                <path d="M23 11H12V0h11v11z" fill="#7FBA00"/>
                <path d="M11 23H0V12h11v11z" fill="#00A4EF"/>
                <path d="M23 23H12V12h11v11z" fill="#FFB900"/>
              </svg>
              Continuar con Microsoft
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex-grow border-t border-red-500/30"></div>
            <span className="mx-4 text-blue-400">o</span>
            <div className="flex-grow border-t border-blue-500/30"></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-blue-400 mb-1">
                Tipo de Usuario
              </label>
              <select
                id="userType"
                name="userType"
                required
                className="w-full px-4 py-3 border border-red-500 rounded-lg bg-black/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Selecciona un tipo de usuario</option>
                <option value={USER_ROLES.CUSTOMER}>Cliente</option>
                <option value={USER_ROLES.RESTAURANT}>Restaurante</option>
                <option value={USER_ROLES.DRIVER}>Repartidor</option>
                <option value={USER_ROLES.ADMIN}>Administrador</option>
              </select>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center p-2 bg-red-900/30 rounded-lg border border-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-blue-700 text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg relative overflow-hidden group"
            >
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>

      {showRegistrationModal && currentUser && (
        <RoleRegistrationModal
          user={currentUser}
          userType={userType}
          onClose={() => setShowRegistrationModal(false)}
          onComplete={handleRegistrationComplete}
        />
      )}

    </div>
  );
};

export default Login;