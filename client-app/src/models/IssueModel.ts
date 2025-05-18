import { Photo } from "./PhotoModel";

export interface Issue {
  id: number;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed'; // Ajusta según tus estados posibles
  issue_type: 'maintenance' | 'accident' | 'technical' | 'other'; // Ajusta según tus tipos
  date_reported: string;
  created_at: string;
  motorcycle_id: number;
  photos: Photo[];
}

export type CreateIssueDto = {
  motorcycle_id: number;
  description: string;
  date_reported: string; // Formato: "YYYY-MM-DD HH:mm:ss"
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  issue_type: 'maintenance' | 'accident' | 'technical' | 'other';
  photos?: File[]; // Opcional para manejar uploads de imágenes en el frontend
};

export type UpdateIssueDto = Partial<CreateIssueDto> & {
  id: number;
};