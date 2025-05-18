import React, { useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from '../../hooks/useNotification';
import { useMenuStore } from '../../store/useMenuStore';

const MenuView: React.FC = () => {
  const { restaurantId, id } = useParams<{ restaurantId: string; id: string }>();
  const { currentMenu, fetchMenuById, removeMenu, loading, error } = useMenuStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMenuById(parseInt(id));
    }
  }, [id, fetchMenuById]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await removeMenu(parseInt(id!));
        showNotification('Ítem del menú eliminado exitosamente', 'success');
        Swal.fire(
          '¡Eliminado!',
          'El ítem del menú ha sido eliminado.',
          'success'
        ).then(() => {
          navigate(`/menus/${restaurantId}`);
        });
      } catch (err) {
        const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
        showNotification(errorMessage, 'error');
        Swal.fire(
          'Error',
          errorMessage,
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!currentMenu) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        Ítem del menú no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/menus${restaurantId}`)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Volver al menú
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{currentMenu.product.name}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/menus/${restaurantId}/edit/${currentMenu.id}`)}
                  className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-50"
                  title="Editar"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                  title="Eliminar"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {currentMenu.product.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{currentMenu.product.description}</p>
            
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Precio original:</span>
                <span className="text-lg text-gray-800">${currentMenu.product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Precio en menú:</span>
                <span className="text-xl font-bold text-gray-800">${currentMenu.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Disponibilidad:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentMenu.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {currentMenu.availability ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Restaurante:</span>
                <span className="text-sm text-gray-800">{currentMenu.restaurant.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuView;