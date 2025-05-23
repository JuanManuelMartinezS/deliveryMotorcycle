// pages/motorcycle/List.tsx
import React, { useEffect } from 'react';
import { FiAlertTriangle, FiClock, FiEdit, FiEye, FiPlay, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from '../../hooks/useNotification';
import { useMotorcycleStore } from '../../store/useMotorcycleStore';

const MotorcycleList: React.FC = () => {
  const { motorcycles, fetchMotorcycles, removeMotorcycle, loading, error } = useMotorcycleStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMotorcycles();
  }, [fetchMotorcycles]);

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
        await removeMotorcycle(id);
        showNotification('Motocicleta eliminada exitosamente', 'success');
        Swal.fire(
          '¡Eliminada!',
          'La motocicleta ha sido eliminada.',
          'success'
        );
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Motocicletas</h1>
        <button
          onClick={() => navigate('/motorcycles/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nueva Motocicleta
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
                    id
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Año
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
                {motorcycles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No hay motocicletas registradas
                    </td>
                  </tr>
                ) : (
                  motorcycles.map((motorcycle) => (
                    <tr key={motorcycle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{motorcycle.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{motorcycle.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{motorcycle.license_plate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{motorcycle.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${motorcycle.status === 'available' ? 'bg-green-100 text-green-800' :
                            motorcycle.status === 'in-maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {motorcycle.status === 'available' ? 'Disponible' :
                            motorcycle.status === 'in-maintenance' ? 'En mantenimiento' : 'No disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/motorcycles/${motorcycle.id}/shifts`)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                            title="Ver turnos"
                          >
                            <FiClock className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/motorcycles/${motorcycle.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/motorcycles/${motorcycle.id}/issues`)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded-full hover:bg-orange-50"
                            title="Ver problemas"
                          >
                            <FiAlertTriangle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/motorcycles/edit/${motorcycle.id}`)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            title="Editar"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/tracking/${motorcycle.license_plate}`)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            title="Empezar simulación"
                          >
                            <FiPlay className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(motorcycle.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Eliminar"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/motorcycles/${motorcycle.id}/${motorcycle.license_plate}/${motorcycle.year}/infringements/new`)}
                            className="text-pink-600 hover:text-pink-900 p-1 rounded-full hover:bg-pink-50"
                            title="Crear infracción"
                          >
                            <FiAlertTriangle className="h-5 w-5" />
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

export default MotorcycleList;