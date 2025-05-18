// pages/shift/View.tsx
import React, { useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from '../../hooks/useNotification';
import { useShiftStore } from '../../store/useShiftStore';

const ShiftView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentShift, fetchShiftById, removeShift, loading, error } = useShiftStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchShiftById(parseInt(id));
    }
  }, [id, fetchShiftById]);

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
        await removeShift(parseInt(id!));
        showNotification('Turno eliminado exitosamente', 'success');
        Swal.fire(
          '¡Eliminado!',
          'El turno ha sido eliminado.',
          'success'
        ).then(() => {
          navigate(-1); // Volver a la página anterior
        });
      } catch (err) {
        const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
        showNotification(errorMessage, 'error');
        Swal.fire('Error', errorMessage, 'error');
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

  if (!currentShift) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        Turno no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Volver
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Detalles del Turno #{currentShift.id}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/shifts/edit/${currentShift.id}`)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Conductor:</span>
                  <span className="text-gray-800">
                    {currentShift.driver?.name || 'N/A'} (ID: {currentShift.driver_id})
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-500">Motocicleta:</span>
                  <span className="text-gray-800">
                    {currentShift.motorcycle?.license_plate || 'N/A'} (ID: {currentShift.motorcycle_id})
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Inicio:</span>
                  <span className="text-gray-800">
                    {new Date(currentShift.start_time).toLocaleString()}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-500">Fin:</span>
                  <span className="text-gray-800">
                    {new Date(currentShift.end_time).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-500">Estado:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${currentShift.status === 'active' ? 'bg-green-100 text-green-800' : 
                    currentShift.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {currentShift.status === 'active' ? 'Activo' : 
                   currentShift.status === 'completed' ? 'Completado' : 'Cancelado'}
                </span>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-500">Creado el:</span>
                <span className="text-gray-800">
                  {new Date(currentShift.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftView;