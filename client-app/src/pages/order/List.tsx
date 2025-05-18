import React, { useEffect } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useOrderStore } from '../../store/useOrderStore';

const OrderList: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { orders, fetchOrders, removeOrder, loading, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId) {
      fetchOrders(parseInt(customerId));
    }
  }, [customerId, fetchOrders]);

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
        <button
          onClick={() => navigate(`/customers`)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Volver a clientes
        </button>
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No hay órdenes registradas para este cliente</p>
          <button
            onClick={() => navigate(`/customers/${customerId}/orders/new`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center mx-auto"
          >
            <FiPlus className="mr-2" />
            Crear Nueva Orden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/customers`)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Volver a clientes
      </button>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Órdenes de {orders[0]?.customer?.name || 'Cliente'}</h1>
        <button
          onClick={() => navigate(`/customers/${customerId}/orders/new`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nueva Orden
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.menu?.product?.name}</div>
                    <div className="text-sm text-gray-500">${order.menu?.price?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.menu?.restaurant?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total_price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' && 'Pendiente'}
                      {order.status === 'preparing' && 'Preparando'}
                      {order.status === 'ready' && 'Listo'}
                      {order.status === 'delivered' && 'Entregado'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td key={`actions-${order.id}`} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        key={`view-${order.id}`}
                        onClick={() => navigate(`/customers/${customerId}/orders/${order.id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="Ver detalles"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        key={`edit-${order.id}`}
                        onClick={() => navigate(`/customers/${customerId}/orders/edit/${order.id}`)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                        title="Editar"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        key={`delete-${order.id}`}
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Eliminar"
                      >
                        <FiTrash2 className="h-5 w-5" />
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
  );
};

export default OrderList;