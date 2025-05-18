// services/customerService.ts
import { Customer } from '../models/CustomerModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getCustomers = async (): Promise<Customer[]> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener clientes');
  }

  return response.json();
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el cliente');
  }

  return response.json();
};

export const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customerData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear cliente');
  }

  return response.json();
};

export const updateCustomer = async (id: number, customerData: Partial<Customer>): Promise<Customer> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customerData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar cliente');
  }

  return response.json();
};

export const deleteCustomer = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar cliente');
  }
};