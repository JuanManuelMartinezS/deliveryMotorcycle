import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useNotification } from '../../hooks/useNotification';
import { useOrderStore } from '../../store/useOrderStore';
import { OrderStatus } from '../../models/OrderModel';

const OrderEdit: React.FC = () => {
  const { customerId, id } = useParams<{ customerId?: string; id: string }>();
  const { currentOrder, fetchOrderById, updateOrder, loading, error } = useOrderStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quantity: 1,
    status: 'pending' as OrderStatus,
    total_price: 0
  });

  useEffect(() => {
    if (id) {
      fetchOrderById(parseInt(id));
    }
  }, [id, fetchOrderById]);

  useEffect(() => {
    if (currentOrder) {
      setFormData({
        quantity: currentOrder.quantity,
        status: currentOrder.status,
        total_price: currentOrder.total_price
      });
    }
  }, [currentOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrder(parseInt(id!), formData);
      showNotification('Orden actualizada exitosamente', 'success');
      if (customerId) {
        navigate(`/customers/${customerId}/orders/${id}`);
      } else {
        navigate(`/orders/${id}`);
      }
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
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
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => customerId ? 
          navigate(`/customers/${customerId}/orders/${id}`) : 
          navigate(`/orders/${id}`)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FiArrowLeft className="mr-1" /> Volver a detalles
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Orden #{currentOrder.id}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <input
              type="text"
              value={currentOrder.menu?.product?.name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurante
            </label>
            <input
              type="text"
              value={currentOrder.menu?.restaurant?.name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pending">Pendiente</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Listo</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label htmlFor="total_price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio Total
            </label>
            <input
              type="number"
              id="total_price"
              name="total_price"
              min="0"
              step="0.01"
              value={formData.total_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => customerId ? 
                navigate(`/customers/${customerId}/orders/${id}`) : 
                navigate(`/orders/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEdit; 