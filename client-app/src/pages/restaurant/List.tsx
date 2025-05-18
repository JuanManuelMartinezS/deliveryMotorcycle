import React, { useEffect } from "react";
import { FiEdit, FiEye, FiMenu, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useNotification } from "../../hooks/useNotification";
import { useRestaurantStore } from "../../store/useRestaurantStore";

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();
  const { restaurants, fetchRestaurants, deleteRestaurant, loading, error } =
    useRestaurantStore();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteRestaurant(id);
        Swal.fire("¡Eliminado!", "El restaurante ha sido eliminado.", "success");
      } catch (err) {
        Swal.fire(
          "Error",
          (err as any)?.response?.data?.message ||
            (err instanceof Error ? err.message : String(err)),
          "error"
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Restaurantes</h1>
        <button
          onClick={() => navigate("/restaurants/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nuevo Restaurante
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No hay restaurantes registrados
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Id
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {restaurant.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {restaurant.created_at &&
                          new Date(restaurant.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-[120px]">{restaurant.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {restaurant.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="line-clamp-1">{restaurant.address}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/restaurants/edit/${restaurant.id}`)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                          title="Editar"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => restaurant.id !== undefined && handleDelete(restaurant.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Eliminar"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/menus/${restaurant.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                          title="Ver Menú"
                        >
                          <FiMenu className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;