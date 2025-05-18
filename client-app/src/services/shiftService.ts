import { CreateShiftDto, Shift } from '../models/ShiftModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Agregar este nuevo método al servicio
export const getShiftsByMotorcycleId = async (motorcycleId: number): Promise<Shift[]> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/motorcycles/${motorcycleId}/shifts`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener turnos por motocicleta');
  }

  return response.json();
};

// Modificar el método getShifts existente para soportar ambos filtros
export const getShifts = async (driverId?: number, motorcycleId?: number): Promise<Shift[]> => {
  const token = await getAccessToken();
  
  let url = `${API_BASE_URL}/shifts`;
  
  if (driverId) {
    url = `${API_BASE_URL}/drivers/${driverId}/shifts`;
  } else if (motorcycleId) {
    url = `${API_BASE_URL}/motorcycles/${motorcycleId}/shifts`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener turnos');
  }

  return response.json();
};

export const getShiftById = async (id: number): Promise<Shift> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/shifts/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el turno');
  }

  return response.json();
};

export const createShift = async (shiftData: CreateShiftDto): Promise<Shift> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/shifts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(shiftData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear turno');
  }

  return response.json();
};

export const updateShift = async (id: number, shiftData: Partial<Shift>): Promise<Shift> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/shifts/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(shiftData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar turno');
  }

  return response.json();
};

export const deleteShift = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/shifts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar turno');
  }
};