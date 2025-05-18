import { CreateIssueDto, Issue, UpdateIssueDto } from '../models/IssueModel';
import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getIssues = async (motorcycleId?: number): Promise<Issue[]> => {
  const token = await getAccessToken();
  const url = motorcycleId 
    ? `${API_BASE_URL}/motorcycles/${motorcycleId}/issues` 
    : `${API_BASE_URL}/issues`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener problemas');
  }

  return response.json();
};

export const getIssueById = async (id: number): Promise<Issue> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el problema');
  }

  return response.json();
};

export const createIssue = async (issueData: CreateIssueDto): Promise<Issue> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(issueData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear problema');
  }

  const data = await response.json();
  // Si la respuesta es un array, tomamos el primer elemento que es el issue
  return Array.isArray(data) ? data[0] : data;
};

export const updateIssue = async (id: number, issueData: UpdateIssueDto): Promise<Issue> => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(issueData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar problema');
  }

  return response.json();
};

export const deleteIssue = async (id: number): Promise<void> => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar problema');
  }
};