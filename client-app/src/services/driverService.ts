// services/driverService.ts
import { Driver } from '../models/DriverModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getDrivers = async (): Promise<Driver[]> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch drivers');
  }

  return response.json();
};

export const getDriverById = async (id: number): Promise<Driver> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch driver');
  }

  return response.json();
};

export const createDriver = async (driverData: Omit<Driver, 'id' | 'created_at'>): Promise<Driver> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(driverData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create driver');
  }

  return response.json();
};

export const updateDriver = async (id: number, driverData: Partial<Driver>): Promise<Driver> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(driverData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update driver');
  }

  return response.json();
};

export const deleteDriver = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete driver');
  }
};