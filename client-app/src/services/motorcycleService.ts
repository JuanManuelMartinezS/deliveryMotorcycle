// services/motorcycleService.ts
import { Motorcycle } from '../models/MotorcycleModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getMotorcycles = async (): Promise<Motorcycle[]> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/motorcycles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch motorcycles');
  }

  return response.json();
};

export const getMotorcycleById = async (id: number): Promise<Motorcycle> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/motorcycles/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch motorcycle');
  }

  return response.json();
};

export const createMotorcycle = async (motorcycleData: Omit<Motorcycle, 'id' | 'created_at'>): Promise<Motorcycle> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/motorcycles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(motorcycleData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create motorcycle');
  }

  return response.json();
};

export const updateMotorcycle = async (id: number, motorcycleData: Partial<Motorcycle>): Promise<Motorcycle> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/motorcycles/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(motorcycleData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update motorcycle');
  }

  return response.json();
};

export const deleteMotorcycle = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/motorcycles/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete motorcycle');
  }
};