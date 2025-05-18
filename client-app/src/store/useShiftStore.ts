import { create } from 'zustand';
import { CreateShiftDto, Shift } from '../models/ShiftModel';
import {
    createShift,
    deleteShift,
    getShiftById,
    getShifts,
    getShiftsByMotorcycleId,
    updateShift,
} from '../services/shiftService';

interface ShiftStore {
  shifts: Shift[];
  loading: boolean;
  error: string | null;
  currentShift: Shift | null;

  fetchShifts: (driverId?: number, motorcycleId?: number) => Promise<void>;
  fetchShiftsByMotorcycle: (motorcycleId: number) => Promise<void>;
  fetchShiftById: (id: number) => Promise<void>;
  addShift: (shiftData: CreateShiftDto) => Promise<Shift>;
  editShift: (id: number, shiftData: Partial<Shift>) => Promise<void>;
  removeShift: (id: number) => Promise<void>;
  setCurrentShift: (shift: Shift | null) => void;
}

export const useShiftStore = create<ShiftStore>((set) => ({
  shifts: [],
  loading: false,
  error: null,
  currentShift: null,

  // Método modificado para soportar ambos filtros
  fetchShifts: async (driverId, motorcycleId) => {
    set({ loading: true, error: null });
    try {
      const data = await getShifts(driverId, motorcycleId);
      set({ shifts: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar turnos'
      });
    }
  },

  // Nuevo método específico para filtrado por motocicleta
  fetchShiftsByMotorcycle: async (motorcycleId) => {
    set({ loading: true, error: null });
    try {
      const data = await getShiftsByMotorcycleId(motorcycleId);
      set({ shifts: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar turnos por motocicleta'
      });
    }
  },

  fetchShiftById: async (id) => {
    set({ loading: true, error: null });
    try {
      const shift = await getShiftById(id);
      set({ currentShift: shift, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el turno'
      });
    }
  },

  setCurrentShift: (shift) => set({ currentShift: shift }),

  addShift: async (shiftData) => {
    set({ loading: true, error: null });
    try {
      const newShift = await createShift(shiftData);
      set(state => ({
        shifts: [...state.shifts, newShift],
        loading: false
      }));
      return newShift;
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear turno'
      });
      throw error;
    }
  },

  editShift: async (id, shiftData) => {
    set({ loading: true, error: null });
    try {
      const updatedShift = await updateShift(id, shiftData);
      set(state => ({
        shifts: state.shifts.map(shift => 
          shift.id === id ? updatedShift : shift
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar turno'
      });
      throw error;
    }
  },

  removeShift: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteShift(id);
      set(state => ({
        shifts: state.shifts.filter(shift => shift.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar turno'
      });
      throw error;
    }
  }
}));