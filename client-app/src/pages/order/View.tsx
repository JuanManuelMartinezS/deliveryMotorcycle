import React, { useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from '../../hooks/useNotification';
import { useOrderStore } from '../../store/useOrderStore';

const OrderView: React.FC = () => {
  const { customerId, id } = useParams<{ customerId?: string; id: string }>();
  const { currentOrder, fetchOrderById, removeOrder, changeOrderStatus, loading, error } = useOrderStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOrderById(parseInt(id));
    }
  }, [id, fetchOrderById]);

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
        await removeOrder(parseInt(id!));
        showNotification('Orden eliminada exitosamente', 'success');
        Swal.fire(
          '¡Eliminado!',
          'La orden ha sido eliminada.',
          'success'
        ).then(() => {
          if (customerId) {
            navigate(`/customers/${customerId}/orders`);
          } else {
            navigate('/orders');
          }
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      await changeOrderStatus(parseInt(id!), newStatus as any);
      showNotification('Estado de la orden actualizado', 'success');
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        Orden no encontrada
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => customerId ? navigate(`/customers/${customerId}/orders`) : navigate('/orders')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Volver a órdenes
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Orden #{currentOrder.id}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => customerId ? 
                    navigate(`/customers/${customerId}/orders/edit/${currentOrder.id}`) : 
                    navigate(`/orders/edit/${currentOrder.id}`)}
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
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status === 'pending' && 'Pendiente'}
                {currentOrder.status === 'preparing' && 'Preparando'}
                {currentOrder.status === 'ready' && 'Listo'}
                {currentOrder.status === 'delivered' && 'Entregado'}
                {currentOrder.status === 'cancelled' && 'Cancelado'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Detalles del Pedido</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Producto:</span> {currentOrder.menu?.product?.name}</p>
                  <p><span className="font-medium">Restaurante:</span> {currentOrder.menu?.restaurant?.name}</p>
                  <p><span className="font-medium">Cantidad:</span> {currentOrder.quantity}</p>
                  <p><span className="font-medium">Precio Unitario:</span> ${currentOrder.menu?.price?.toLocaleString()}</p>
                  <p><span className="font-medium">Total:</span> ${currentOrder.total_price?.toLocaleString()}</p>
                  <p><span className="font-medium">Fecha:</span> {new Date(currentOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Información del Cliente</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Nombre:</span> {currentOrder.customer?.name}</p>
                  <p><span className="font-medium">Email:</span> {currentOrder.customer?.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {currentOrder.customer?.phone}</p>
                  {currentOrder.address ? (
                    <>
                      <p><span className="font-medium">Dirección:</span> {currentOrder.address.street}</p>
                      <p><span className="font-medium">Ciudad:</span> {currentOrder.address.city}</p>
                      <p><span className="font-medium">Estado:</span> {currentOrder.address.state}</p>
                      <p><span className="font-medium">Código Postal:</span> {currentOrder.address.postal_code}</p>
                      {currentOrder.address.additional_info && (
                        <p><span className="font-medium">Información Adicional:</span> {currentOrder.address.additional_info}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">No se especificó dirección de entrega</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cambiar estado:</h3>
              <div className="flex flex-wrap gap-2">
                {currentOrder.status !== 'preparing' && (
                  <button
                    onClick={() => handleStatusChange('preparing')}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded hover:bg-blue-200"
                  >
                    Marcar como Preparando
                  </button>
                )}
                {currentOrder.status !== 'ready' && (
                  <button
                    onClick={() => handleStatusChange('ready')}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded hover:bg-orange-200"
                  >
                    Marcar como Listo
                  </button>
                )}
                {currentOrder.status !== 'delivered' && (
                  <button
                    onClick={() => handleStatusChange('delivered')}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200"
                  >
                    Marcar como Entregado
                  </button>
                )}
                {currentOrder.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200"
                  >
                    Cancelar Orden
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
