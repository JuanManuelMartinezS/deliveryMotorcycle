import React, { useState } from 'react';
import { saveUserData, USER_ROLES } from '../services/authService';

const RoleRegistrationModal = ({ user, userType, onClose, onComplete }) => {
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    // Campos específicos por rol
    ...(userType === USER_ROLES.DRIVER && {
      license_number: '',
      status: 'available'
    }),
    ...(userType === USER_ROLES.RESTAURANT && {
      address: '',
      description: ''
    }),
    ...(userType === USER_ROLES.CUSTOMER && {
      address: ''
    })
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      const userData = await saveUserData(user, {
        userType,
        ...formData
      });
      
      if (!userData) {
        throw new Error('No se pudieron guardar los datos del usuario');
      }

      onComplete(userData);
    } catch (error) {
      console.error('Error al guardar datos:', error);
      setError(error.message || 'Error al guardar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleSpecificFields = () => {
    switch (userType) {
      case USER_ROLES.DRIVER:
        return (
          <>
            <div>
              <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                Número de Licencia
              </label>
              <input
                type="text"
                name="license_number"
                id="license_number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.license_number}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case USER_ROLES.RESTAURANT:
        return (
          <>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case USER_ROLES.CUSTOMER:
        return (
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              id="address"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          Complete su información
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
              value={formData.email}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {getRoleSpecificFields()}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleRegistrationModal; 