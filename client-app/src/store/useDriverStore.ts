// stores/useDriverStore.ts
import { create } from 'zustand';
import { Driver } from '../models/DriverModel';
import {
    createDriver,
    deleteDriver,
    getDriverById,
    getDrivers,
    updateDriver
} from '../services/driverService';

interface DriverStore {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  currentDriver: Driver | null;

  fetchDrivers: () => Promise<void>;
  addDriver: (driver: Omit<Driver, 'id' | 'created_at'>) => Promise<void>;
  editDriver: (id: number, driver: Partial<Driver>) => Promise<void>;
  removeDriver: (id: number) => Promise<void>;
  fetchDriverById: (id: number) => Promise<void>;
  setCurrentDriver: (driver: Driver | null) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [],
  loading: false,
  error: null,
  currentDriver: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getDrivers();
      set({ drivers: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load drivers'
      });
    }
  },

  fetchDriverById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const driver = await getDriverById(id);
      set({ currentDriver: driver, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load driver'
      });
    }
  },

  setCurrentDriver: (driver: Driver | null) => set({ currentDriver: driver }),

  addDriver: async (driverData) => {
    set({ loading: true, error: null });
    try {
      const newDriver = await createDriver(driverData);
      set(state => ({
        drivers: [...state.drivers, newDriver],
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create driver'
      });
      throw error;
    }
  },

  editDriver: async (id, driverData) => {
    set({ loading: true, error: null });
    try {
      const updatedDriver = await updateDriver(id, driverData);
      set(state => ({
        drivers: state.drivers.map(driver => 
          driver.id === id ? updatedDriver : driver
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update driver'
      });
      throw error;
    }
  },

  removeDriver: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDriver(id);
      set(state => ({
        drivers: state.drivers.filter(driver => driver.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete driver'
      });
      throw error;
    }
  }
}));