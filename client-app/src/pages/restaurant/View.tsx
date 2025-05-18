import React, { useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from '../../hooks/useNotification';
import { useRestaurantStore } from '../../store/useRestaurantStore';


const RestaurantView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentRestaurant, 
    fetchRestaurantById, 
    deleteRestaurant,
    loading, 
    error,
    resetCurrent
  } = useRestaurantStore();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (id) {
      fetchRestaurantById(parseInt(id));
    }
    return () => resetCurrent();
  }, [id, fetchRestaurantById, resetCurrent]);

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
         await deleteRestaurant(parseInt(id!));
         showNotification('Restaurante eliminado exitosamente', 'success');
         Swal.fire(
           '¡Eliminado!',
           'El restaurante ha sido eliminado.',
           'success'
         ).then(() => {
           navigate('/restaurants');
         });
       } catch (err) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          Restaurante no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/restaurants')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FiArrowLeft className="mr-1" /> Volver a la lista
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{currentRestaurant.name}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/restaurants/edit/${currentRestaurant.id}`)}
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
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-sm text-gray-900">{currentRestaurant.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                <p className="text-sm text-gray-900">{currentRestaurant.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                <p className="text-sm text-gray-900">{currentRestaurant.address}</p>
              </div>
              
              {currentRestaurant.created_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de creación</h3>
                  <p className="text-sm text-gray-900">
                    {new Date(currentRestaurant.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;