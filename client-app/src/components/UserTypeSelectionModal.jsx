import React from 'react';

const UserTypeSelectionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const userTypes = [
    {
      id: 'customers',
      name: 'Cliente',
      description: 'Quiero ordenar comida y recibirla en mi ubicación'
    },
    {
      id: 'restaurants',
      name: 'Restaurante',
      description: 'Quiero vender mis productos a través de la plataforma'
    },
    {
      id: 'drivers',
      name: 'Repartidor',
      description: 'Quiero entregar pedidos y ganar dinero'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Selecciona tu tipo de cuenta</h2>
        <p className="text-gray-600 mb-6">¿Cómo quieres usar la plataforma?</p>

        <div className="space-y-4">
          {userTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className="w-full p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
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

export default UserTypeSelectionModal; 