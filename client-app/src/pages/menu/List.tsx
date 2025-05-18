import React, { useEffect } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useMenuStore } from '../../store/useMenuStore';

const MenuList: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { menus, fetchMenus, removeMenu, loading, error } = useMenuStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (restaurantId) {
      fetchMenus(parseInt(restaurantId));
    }
  }, [restaurantId, fetchMenus]);

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
        await removeMenu(id);
        Swal.fire(
          '¡Eliminado!',
          'El ítem del menú ha sido eliminado.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'Error',
          (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err)),
          'error'
        );
      }
    }
  };

  if (!menus || menus.length === 0) return <div>No hay menús disponibles.
            <button
          onClick={() => navigate(`/menus/${restaurantId}/new`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 mt-5 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nuevo Ítem
        </button>
  </div>;

  return (
    <div className="space-y-6">
            <button
        onClick={() => navigate(`/restaurants`)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Volver a restaurantes
      </button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Menú del Restaurante {restaurantId}</h1>
        <button
          onClick={() => navigate(`/menus/${restaurantId}/new`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nuevo Ítem
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
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponibilidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No hay ítems en el menú
                    </td>
                  </tr>
                ) : (
                  menus.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{menu.product?.name || 'Sin producto'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{menu.product?.description || 'Sin descripción'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${menu.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${menu.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {menu.availability ? 'Disponible' : 'No disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/menus/${restaurantId}/${menu.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/menus/${restaurantId}/edit/${menu.id}`)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            title="Editar"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(menu.id)}
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

export default MenuList;