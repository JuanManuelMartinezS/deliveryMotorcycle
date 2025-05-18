// src/components/SelectRole.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUserRole, USER_ROLES } from '../services/authService';

const SelectRole = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSelectRole = async (role) => {
    if (!currentUser) {
      setError('Debes iniciar sesión para seleccionar un rol');
      return;
    }

    setLoading(true);
    setSelectedRole(role);
    setError('');
    
    try {
      await updateUserRole(currentUser.uid, role);
      
      // Redirigir según el rol seleccionado
      switch (role) {
        case USER_ROLES.RESTAURANT:
          navigate('/restaurant/dashboard');
          break;
        case USER_ROLES.CUSTOMER:
          navigate('/customer/dashboard');
          break;
        case USER_ROLES.DRIVER:
          navigate('/driver/dashboard');
          break;
        case USER_ROLES.OPERATOR:
          navigate('/operator/dashboard');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      setError(`Error al actualizar el rol: ${error.message}`);
      console.error('Error al actualizar rol:', error);
    } finally {
      setLoading(false);
      setSelectedRole(null);
    }
  };

  const RoleCard = ({ role, title, description, icon, color }) => (
    <div 
      onClick={() => !loading && handleSelectRole(role)}
      className={`border rounded-lg p-6 cursor-pointer transition-all ${
        loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
      } flex flex-col items-center`}
    >
      <div className={`h-16 w-16 ${color} flex items-center justify-center rounded-full mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-center">
        {description}
      </p>
      {loading && selectedRole === role && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Selecciona tu Rol</h2>
          <p className="text-gray-600 mt-2">
            Escoge el tipo de usuario que mejor describe tu rol en el sistema
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoleCard
            role={USER_ROLES.RESTAURANT}
            title="Restaurante"
            description="Gestiona tu menú, recibe pedidos y supervisa las entregas."
            color="bg-yellow-500"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21H3" />
              </svg>
            }
          />
          
          <RoleCard
            role={USER_ROLES.CUSTOMER}
            title="Cliente"
            description="Realiza pedidos, rastrea entregas y guarda tus direcciones favoritas."
            color="bg-blue-500"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          
          <RoleCard
            role={USER_ROLES.DRIVER}
            title="Conductor"
            description="Acepta entregas, optimiza rutas y reporta el estado de los pedidos."
            color="bg-green-500"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }
          />
          
          <RoleCard
            role={USER_ROLES.OPERATOR}
            title="Operador"
            description="Gestiona el sistema, asigna conductores y resuelve incidencias."
            color="bg-purple-500"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SelectRole;