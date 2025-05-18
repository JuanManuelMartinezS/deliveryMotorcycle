import React from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'customer',
      name: 'Cliente',
      description: 'Quiero ordenar comida y recibirla en mi ubicación'
    },
    {
      id: 'restaurant',
      name: 'Restaurante',
      description: 'Quiero vender mis productos a través de la plataforma'
    },
    {
      id: 'driver',
      name: 'Repartidor',
      description: 'Quiero entregar pedidos y ganar dinero'
    },
    {
      id: 'operator',
      name: 'Operador',
      description: 'Quiero gestionar la plataforma'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Selecciona tu rol</h2>
        <p className="text-gray-600 mb-6">¿Cómo quieres usar la plataforma?</p>

        <div className="space-y-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className="w-full p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">{role.name}</h3>
              <p className="text-sm text-gray-600">{role.description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal; 