// pages/shift/List.tsx
import React, { useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useShiftStore } from '../../store/useShiftStore';

const ShiftList: React.FC = () => {
  const { driverId, motorcycleId } = useParams<{ driverId?: string; motorcycleId?: string }>();
  const { shifts, fetchShifts, removeShift, loading, error } = useShiftStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (driverId) {
      fetchShifts(parseInt(driverId));
    } else if (motorcycleId) {
      fetchShifts(undefined, parseInt(motorcycleId));
    } else {
      fetchShifts();
    }
  }, [driverId, motorcycleId, fetchShifts]);

  const handleDelete = async (id: number) => {
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
        await removeShift(id);
        Swal.fire('¡Eliminado!', 'El turno ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire(
          'Error',
          (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err)),
          'error'
        );
      }
    }
  };

  const getTitle = () => {
    if (driverId) return 'Turnos del Conductor';
    if (motorcycleId) return 'Turnos de la Motocicleta';
    return 'Todos los Turnos';
  };

  return (
    <div className="space-y-6">
                {driverId && (<button
                onClick={() => navigate('/drivers')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiArrowLeft className="mr-1" /> Volver a la lista
              </button>)}
        
            {motorcycleId && (<button
                onClick={() => navigate('/motorcycles')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiArrowLeft className="mr-1" /> Volver a la lista
              </button>)}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
        <button
          onClick={() => navigate(driverId ? `/drivers/${driverId}/shifts/new` : motorcycleId ? `/motorcycles/${motorcycleId}/shifts/new` : '/shifts/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nuevo Turno
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conductor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motocicleta
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inicio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shifts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No hay turnos registrados
                    </td>
                  </tr>
                ) : (
                  shifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shift.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shift.driver?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{shift.motorcycle?.license_plate || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(shift.start_time).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(shift.end_time).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${shift.status === 'active' ? 'bg-green-100 text-green-800' : 
                            shift.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {shift.status === 'active' ? 'Activo' : 
                           shift.status === 'completed' ? 'Completado' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/shifts/${shift.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/shifts/edit/${shift.id}`)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            title="Editar"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(shift.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Eliminar"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftList;