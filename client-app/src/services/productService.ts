// services/productService.ts
import { Product } from '../models/ProductModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (): Promise<Product[]> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener productos');
  }

  return response.json();
};
// Añade esta función al servicio existente
export const getProductById = async (id: number): Promise<Product> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el producto');
  }

  return response.json();
};
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear producto');
  }

  return response.json();
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar producto');
  }

  return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar producto');
  }
};