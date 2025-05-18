import { Address } from '../models/AddressModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getAddresses = async (): Promise<Address[]> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener direcciones');
  }

  return response.json();
};

export const getAddressById = async (id: number): Promise<Address> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener la dirección');
  }

  return response.json();
};

export const createAddress = async (addressData: Omit<Address, 'id' | 'created_at'>): Promise<Address> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...addressData,
      postal_code: Number(addressData.postal_code) // Asegurar que sea número
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear dirección');
  }

  return response.json();
};

export const updateAddress = async (id: number, addressData: Partial<Address>): Promise<Address> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...addressData,
      ...(addressData.postal_code && { postal_code: Number(addressData.postal_code) })
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar dirección');
  }

  return response.json();
};

export const deleteAddress = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar dirección');
  }
};