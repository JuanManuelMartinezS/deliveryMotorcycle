import { Driver } from "./DriverModel";
import { Motorcycle } from "./MotorcycleModel";

export interface Shift {
  id: number;
  driver_id: number;
  motorcycle_id: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'completed' | 'canceled';
  created_at: string;
  driver?: Driver;
  motorcycle?: Motorcycle; 
}

export type CreateShiftDto = {
  driver_id: number;
  motorcycle_id: number;
  start_time: string; // Formato: "YYYY-MM-DD HH:mm:ss"
  end_time: string; // Formato: "YYYY-MM-DD HH:mm:ss"
  status: 'active' | 'completed' | 'canceled';
};