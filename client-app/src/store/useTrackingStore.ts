// stores/useTrackingStore.ts
import { create } from 'zustand';
import { trackingService } from '../services/trackingService';

interface TrackingState {
  currentPosition: { lat: number; lng: number } | null;
  isTracking: boolean;
  startTracking: (plate: string) => void;
  stopTracking: () => void;
  updatePosition: (coords: { lat: number; lng: number }) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  currentPosition: null,
  isTracking: false,

  startTracking: (plate) => {
    trackingService.connect(plate);
    trackingService.addListener((coords) => {
      set({ currentPosition: coords });
    });
    set({ isTracking: true });
  },

  stopTracking: () => {
    trackingService.disconnect();
    set({ isTracking: false, currentPosition: null });
  },

  updatePosition: (coords) => set({ currentPosition: coords }),
}));