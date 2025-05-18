// models/DriverModel.ts
export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  status: 'available' | 'unavailable' | 'on-delivery';
  created_at: string; // Fecha en formato ISO 8601
}