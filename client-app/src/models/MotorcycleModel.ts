// models/MotorcycleModel.ts
export interface Motorcycle {
  id: number;
  brand: string;
  license_plate: string;
  year: number;
  status: 'available' | 'unavailable' | 'in-maintenance';
  created_at: string; // Fecha en formato ISO 8601
}