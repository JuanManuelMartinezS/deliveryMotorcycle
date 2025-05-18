// Versión con menú desplegable
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { logOut } from '../services/authService';
import { NotificationDropdown } from './NotificationDropdown';

const Topbar = ({ toggleSidebar }) => {
   const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-full hover:bg-orange-100 md:hidden"
          >
            <FiMenu className="text-red-600" size={20} />
          </button>
          <h1 className="text-xl font-semibold text-red-800">Panel de Control</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
               <div className="flex items-center space-x-3">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-gray-700">{currentUser?.displayName}</span>
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 w-full text-left"
                >
                  <FiUser className="mr-2" /> Perfil
                </button>
                <button 
                  onClick={() => {
                    navigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 w-full text-left"
                >
                  <FiSettings className="mr-2" /> Configuración
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 w-full text-left"
                >
                  <FiLogOut className="mr-2" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;