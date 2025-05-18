import { Menu } from '../models/MenuModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getMenus = async (restaurantId?: number): Promise<Menu[]> => {
  const token = await getAccessToken();
  const url = restaurantId 
    ? `${API_BASE_URL}/restaurants/${restaurantId}/menus` 
    : `${API_BASE_URL}/menus`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener menús');
  }

  return response.json();
};

export const getMenuById = async (id: number): Promise<Menu> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el menú');
  }

  return response.json();
};

export const createMenu = async (menuData: Omit<Menu, 'id' | 'created_at' | 'product' | 'restaurant'>): Promise<Menu> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/menus`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(menuData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear menú');
  }

  return response.json();
};

export const updateMenu = async (id: number, menuData: Partial<Menu>): Promise<Menu> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(menuData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar menú');
  }

  return response.json();
};

export const deleteMenu = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar menú');
  }
};