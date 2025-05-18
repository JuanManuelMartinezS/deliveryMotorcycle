// src/services/apiService.js
import { auth } from '../firebase/firebaseConfig';
import { getAccessToken } from './authService';

// URL base de la API
const API_BASE_URL = 'http://localhost:5000'; // Ajustar según la ubicación de tu API

// Función para crear cabeceras con el token de autenticación
const getAuthHeaders = async () => {
  const token = await getAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const apiRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data: object | null = null
): Promise<T> => {
  try {
    // 1. Obtener el token de acceso actual
    let token = await getAccessToken();

    // 2. Configurar headers iniciales con el token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include' // Si usas cookies para sesiones
    };

    // 3. Agregar body si es necesario
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    // 4. Hacer la primera solicitud
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 5. Manejar token expirado (401 Unauthorized)
    if (response.status === 401) {
      // Forzar refresco del token
      token = (await auth.currentUser?.getIdToken(true)) ?? null;

      // Actualizar headers con el nuevo token
      headers.Authorization = `Bearer ${token}`;
      // Reintentar la solicitud con el nuevo token
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    }
    // Verificar si la respuesta es HTML
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const html = await response.text();
      if (html.includes('<!doctype html>')) {
        throw new Error('El backend devolvió HTML en lugar de JSON. Verifica la URL y la configuración del servidor.');
      }
    }
    // 6. Manejar errores de la respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // 7. Manejar respuestas vacías (como en DELETE)
    if (response.status === 204) {
      return {} as T;
    }

    // 8. Retornar los datos parseados
    return await response.json();
  } catch (error) {
    console.error('Error detallado:', {
      error,
      endpoint,
      method
    });
    throw error;
  }
};
// Restaurants
export const getRestaurants = () => apiRequest('/restaurants');
export const getRestaurantById = (id) => apiRequest(`/restaurants/${id}`);
export const createRestaurant = (data) => apiRequest('/restaurants', 'POST', data);
export const updateRestaurant = (id, data) => apiRequest(`/restaurants/${id}`, 'PUT', data);
export const deleteRestaurant = (id) => apiRequest(`/restaurants/${id}`, 'DELETE');

// Products
export const getProducts = () => apiRequest('/products');
export const getProductById = (id) => apiRequest(`/products/${id}`);
export const createProduct = (data) => apiRequest('/products', 'POST', data);
export const updateProduct = (id, data) => apiRequest(`/products/${id}`, 'PUT', data);
export const deleteProduct = (id) => apiRequest(`/products/${id}`, 'DELETE');

// Menus
export const getMenus = () => apiRequest('/menus');
export const getMenuById = (id) => apiRequest(`/menus/${id}`);
export const createMenu = (data) => apiRequest('/menus', 'POST', data);
export const updateMenu = (id, data) => apiRequest(`/menus/${id}`, 'PUT', data);
export const deleteMenu = (id) => apiRequest(`/menus/${id}`, 'DELETE');

// Customers
export const getCustomers = () => apiRequest('/customers');
export const getCustomerById = (id) => apiRequest(`/customers/${id}`);
export const createCustomer = (data) => apiRequest('/customers', 'POST', data);
export const updateCustomer = (id, data) => apiRequest(`/customers/${id}`, 'PUT', data);
export const deleteCustomer = (id) => apiRequest(`/customers/${id}`, 'DELETE');

// Orders
export const getOrders = () => apiRequest('/orders');
export const getOrderById = (id) => apiRequest(`/orders/${id}`);
export const createOrder = (data) => apiRequest('/orders', 'POST', data);
export const updateOrder = (id, data) => apiRequest(`/orders/${id}`, 'PUT', data);
export const deleteOrder = (id) => apiRequest(`/orders/${id}`, 'DELETE');

// Addresses
export const getAddresses = () => apiRequest('/addresses');
export const getAddressById = (id) => apiRequest(`/addresses/${id}`);
export const createAddress = (data) => apiRequest('/addresses', 'POST', data);
export const updateAddress = (id, data) => apiRequest(`/addresses/${id}`, 'PUT', data);
export const deleteAddress = (id) => apiRequest(`/addresses/${id}`, 'DELETE');

// Motorcycles
export const getMotorcycles = () => apiRequest('/motorcycles');
export const getMotorcycleById = (id) => apiRequest(`/motorcycles/${id}`);
export const createMotorcycle = (data) => apiRequest('/motorcycles', 'POST', data);
export const updateMotorcycle = (id, data) => apiRequest(`/motorcycles/${id}`, 'PUT', data);
export const deleteMotorcycle = (id) => apiRequest(`/motorcycles/${id}`, 'DELETE');
export const startTracking = (plate) => apiRequest(`/motorcycles/track/${plate}`, 'POST');
export const stopTracking = (plate) => apiRequest(`/motorcycles/stop/${plate}`, 'POST');

// Drivers
export const getDrivers = () => apiRequest('/drivers');
export const getDriverById = (id) => apiRequest(`/drivers/${id}`);
export const createDriver = (data) => apiRequest('/drivers', 'POST', data);
export const updateDriver = (id, data) => apiRequest(`/drivers/${id}`, 'PUT', data);
export const deleteDriver = (id) => apiRequest(`/drivers/${id}`, 'DELETE');

// Shifts
export const getShifts = () => apiRequest('/shifts');
export const getShiftById = (id) => apiRequest(`/shifts/${id}`);
export const createShift = (data) => apiRequest('/shifts', 'POST', data);
export const updateShift = (id, data) => apiRequest(`/shifts/${id}`, 'PUT', data);
export const deleteShift = (id) => apiRequest(`/shifts/${id}`, 'DELETE');

// Issues
export const getIssues = () => apiRequest('/issues');
export const getIssueById = (id) => apiRequest(`/issues/${id}`);
export const createIssue = (data) => apiRequest('/issues', 'POST', data);
export const updateIssue = (id, data) => apiRequest(`/issues/${id}`, 'PUT', data);
export const deleteIssue = (id) => apiRequest(`/issues/${id}`, 'DELETE');

// Photos
export const getPhotos = () => apiRequest('/photos');
export const getPhotoById = (id) => apiRequest(`/photos/${id}`);
export const createPhoto = (data) => apiRequest('/photos', 'POST', data);
export const updatePhoto = (id, data) => apiRequest(`/photos/${id}`, 'PUT', data);
export const deletePhoto = (id) => apiRequest(`/photos/${id}`, 'DELETE');

// Upload Photo
export const uploadPhoto = async (formData) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}/photos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Photo upload failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};