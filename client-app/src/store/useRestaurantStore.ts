// stores/useRestaurantStore.ts
import { create } from 'zustand';
import { 
  CreateRestaurantDto, 
  UpdateRestaurantDto,
  getRestaurants,
  getRestaurantById,
  createRestaurant as apiCreateRestaurant,
  updateRestaurant as apiUpdateRestaurant,
  deleteRestaurant as apiDeleteRestaurant
} from '../services/restaurantService';
import { Restaurant } from '../models/RestaurantModel';

interface RestaurantStore {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRestaurants: () => Promise<void>;
  fetchRestaurantById: (id: number) => Promise<void>;
  createRestaurant: (restaurant: CreateRestaurantDto) => Promise<Restaurant>;
  updateRestaurant: (id: number, restaurant: UpdateRestaurantDto) => Promise<void>;
  deleteRestaurant: (id: number) => Promise<void>;
  resetCurrent: () => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,

  fetchRestaurants: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRestaurants();
      set({ restaurants: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar restaurantes' 
      });
    }
  },
    
  fetchRestaurantById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await getRestaurantById(id);
      set({ currentRestaurant: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el restaurante' 
      });
    }
  },
    
  createRestaurant: async (restaurantData: CreateRestaurantDto) => {
    set({ loading: true, error: null });
    try {
      const newRestaurant = await apiCreateRestaurant(restaurantData);
      set(state => ({ 
        restaurants: [...state.restaurants, newRestaurant],
        loading: false 
      }));
      return newRestaurant;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al crear restaurante' 
      });
      throw error;
    }
  },
    
  updateRestaurant: async (id: number, restaurantData: UpdateRestaurantDto) => {
    set({ loading: true, error: null });
    try {
      const updatedRestaurant = await apiUpdateRestaurant(id, restaurantData);
      set(state => ({
        restaurants: state.restaurants.map(restaurant => 
          restaurant.id === id ? updatedRestaurant : restaurant
        ),
        currentRestaurant: updatedRestaurant,
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar restaurante' 
      });
      throw error;
    }
  },
    
  deleteRestaurant: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteRestaurant(id);
      set(state => ({
        restaurants: state.restaurants.filter(restaurant => restaurant.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar restaurante' 
      });
      throw error;
    }
  },
    
  resetCurrent: () => set({ currentRestaurant: null, error: null })
}));