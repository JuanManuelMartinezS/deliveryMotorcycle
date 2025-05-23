import { infringement} from '../models/Infringement';
import { MotorcycleInfringement } from '../models/MotorcycleInfringement';
const API_BASE = 'https://c18288b0-cb40-471b-b43d-aa127fec56ba.mock.pstmn.io';

export async function getInfringements(): Promise<infringement[]> {
  const response = await fetch(`${API_BASE}/infringement`);
  console.log("infringements",response);
  
  if (!response.ok) throw new Error('Error al obtener infracciones');
  return response.json();
}

export async function createMotorcycleInfringement(data: any): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/motorcycleInfringement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear infracción');
  }
  
  // Si la respuesta no tiene contenido, devolvemos un objeto simple
  if (response.status === 200 && response.bodyUsed === false) {
    return { success: true };
  }
  
  try {
    return await response.json();
  } catch (error) {
    // Si falla el parseo pero la respuesta fue exitosa
    return { success: true };
  }
}