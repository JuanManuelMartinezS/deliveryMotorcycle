import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { logOut, getUserRoles, changeUserRole, USER_ROLES } from '../services/authService';

const Navigation = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('currentRole'));
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      const user = auth.currentUser;
      if (user) {
        const roles = await getUserRoles(user);
        setAvailableRoles(roles);
      }
    };
    loadRoles();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem('currentRole');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      setLoading(true);
      await changeUserRole(newRole);
      setCurrentRole(newRole);
      navigate(`/${newRole}/dashboard`);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrador';
      case USER_ROLES.CUSTOMER:
        return 'Cliente';
      case USER_ROLES.RESTAURANT:
        return 'Restaurante';
      case USER_ROLES.DRIVER:
        return 'Repartidor';
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Delivery App</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {availableRoles.length > 1 && (
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {getRoleLabel(role)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 