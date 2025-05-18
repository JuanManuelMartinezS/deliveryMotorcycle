// services/restaurantService.ts
import { auth } from '../firebase/firebaseConfig';
import { Restaurant } from '../models/RestaurantModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;



export type CreateRestaurantDto = Omit<Restaurant, 'id' | 'created_at'>;
export type UpdateRestaurantDto = Partial<CreateRestaurantDto>;

const handleApiError = async (response: Response): Promise<never> => {
  if (response.status === 401) {
    await auth.currentUser?.getIdToken(true);
    throw new Error('Sesión expirada, por favor vuelve a intentarlo');
  }

  let errorMessage = `Error ${response.status}: ${response.statusText}`;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    // Si no podemos parsear el error como JSON, mantener el mensaje original
  }

  throw new Error(errorMessage);
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = await getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    return handleApiError(response);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Operaciones CRUD
export const getRestaurants = async (): Promise<Restaurant[]> => {
  return fetchWithAuth('/restaurants');
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
  return fetchWithAuth(`/restaurants/${id}`);
};

export const createRestaurant = async (restaurant: CreateRestaurantDto): Promise<Restaurant> => {
  return fetchWithAuth('/restaurants', {
    method: 'POST',
    body: JSON.stringify(restaurant)
  });
};

export const updateRestaurant = async (id: number, restaurant: UpdateRestaurantDto): Promise<Restaurant> => {
  return fetchWithAuth(`/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(restaurant)
  });
};

export const deleteRestaurant = async (id: number): Promise<void> => {
  await fetchWithAuth(`/restaurants/${id}`, {
    method: 'DELETE'
  });
};