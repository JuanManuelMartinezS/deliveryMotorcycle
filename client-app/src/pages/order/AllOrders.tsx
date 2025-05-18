import React, { useEffect } from 'react';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useOrderStore } from '../../store/useOrderStore';

const AllOrders: React.FC = () => {
  const { orders, fetchOrders, removeOrder, loading, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(); // Fetch all orders without customer filter
  }, [fetchOrders]);

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
        await removeOrder(id);
        Swal.fire(
          '¡Eliminado!',
          'La orden ha sido eliminada.',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-10">
          <p className="text-gray-600">No hay órdenes registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Todas las Órdenes</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Producto</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Restaurante</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cant.</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Estado</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Fecha</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{order.customer?.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{order.customer?.email}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{order.menu?.product?.name}</div>
                        <div className="text-sm text-gray-500">${order.menu?.price?.toLocaleString()}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900 truncate max-w-[120px] sm:max-w-none">{order.menu?.restaurant?.name}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total_price?.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status === 'pending' && 'Pendiente'}
                          {order.status === 'preparing' && 'Preparando'}
                          {order.status === 'ready' && 'Listo'}
                          {order.status === 'delivered' && 'Entregado'}
                          {order.status === 'cancelled' && 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1 sm:space-x-2">
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/orders/edit/${order.id}`)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            title="Editar"
                          >
                            <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Eliminar"
                          >
                            <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders; 