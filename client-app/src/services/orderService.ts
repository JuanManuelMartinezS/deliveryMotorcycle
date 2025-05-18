import { Order, OrderStatus } from '../models/OrderModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getOrders = async (customerId?: number): Promise<Order[]> => {
  const token = await getAccessToken();
  const url = customerId 
    ? `${API_BASE_URL}/customers/${customerId}/orders` 
    : `${API_BASE_URL}/orders`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener órdenes');
  }

  return response.json();
};

export const getOrderById = async (id: number): Promise<Order> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener la orden');
  }

  return response.json();
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'customer' | 'menu' | 'address'>): Promise<Order> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear orden');
  }

  return response.json();
};

export const updateOrder = async (id: number, orderData: Partial<Order>): Promise<Order> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar orden');
  }

  return response.json();
};

export const deleteOrder = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar orden');
  }
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar estado de la orden');
  }

  return response.json();
};