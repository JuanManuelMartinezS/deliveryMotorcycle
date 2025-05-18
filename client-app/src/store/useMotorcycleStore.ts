// stores/useMotorcycleStore.ts
import { create } from 'zustand';
import { Motorcycle } from '../models/MotorcycleModel';
import {
    createMotorcycle,
    deleteMotorcycle,
    getMotorcycleById,
    getMotorcycles,
    updateMotorcycle
} from '../services/motorcycleService';

interface MotorcycleStore {
  motorcycles: Motorcycle[];
  loading: boolean;
  error: string | null;
  currentMotorcycle: Motorcycle | null;

  fetchMotorcycles: () => Promise<void>;
  addMotorcycle: (motorcycle: Omit<Motorcycle, 'id' | 'created_at'>) => Promise<void>;
  editMotorcycle: (id: number, motorcycle: Partial<Motorcycle>) => Promise<void>;
  removeMotorcycle: (id: number) => Promise<void>;
  fetchMotorcycleById: (id: number) => Promise<void>;
  setCurrentMotorcycle: (motorcycle: Motorcycle | null) => void;
}

export const useMotorcycleStore = create<MotorcycleStore>((set) => ({
  motorcycles: [],
  loading: false,
  error: null,
  currentMotorcycle: null,

  fetchMotorcycles: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getMotorcycles();
      set({ motorcycles: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load motorcycles'
      });
    }
  },

  fetchMotorcycleById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const motorcycle = await getMotorcycleById(id);
      set({ currentMotorcycle: motorcycle, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load motorcycle'
      });
    }
  },

  setCurrentMotorcycle: (motorcycle: Motorcycle | null) => set({ currentMotorcycle: motorcycle }),

  addMotorcycle: async (motorcycleData) => {
    set({ loading: true, error: null });
    try {
      const newMotorcycle = await createMotorcycle(motorcycleData);
      set(state => ({
        motorcycles: [...state.motorcycles, newMotorcycle],
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create motorcycle'
      });
      throw error;
    }
  },

  editMotorcycle: async (id, motorcycleData) => {
    set({ loading: true, error: null });
    try {
      const updatedMotorcycle = await updateMotorcycle(id, motorcycleData);
      set(state => ({
        motorcycles: state.motorcycles.map(motorcycle => 
          motorcycle.id === id ? updatedMotorcycle : motorcycle
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update motorcycle'
      });
      throw error;
    }
  },

  removeMotorcycle: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteMotorcycle(id);
      set(state => ({
        motorcycles: state.motorcycles.filter(motorcycle => motorcycle.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete motorcycle'
      });
      throw error;
    }
  }
}));