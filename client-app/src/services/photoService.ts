import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface Photo {
  id: number;
  issue_id: number;
  image_url: string;
  caption: string | null;
  taken_at: string | null;
  created_at: string;
}

export interface CreatePhotoDto {
  issue_id: number;
  image_url: string;
  caption?: string;
  taken_at?: string;
}

export const uploadPhoto = async (photoData: CreatePhotoDto): Promise<Photo> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/photos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(photoData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al subir la foto');
  }

  return response.json();
};

export const getPhotosByIssueId = async (issueId: number): Promise<Photo[]> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}/photos`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener las fotos');
  }

  return response.json();
};

export const deletePhoto = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar la foto');
  }
};

export const updatePhoto = async (photoId: number, data: CreatePhotoDto): Promise<Photo> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar la foto');
  }

  return response.json();
}; 