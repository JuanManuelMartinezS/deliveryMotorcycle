import { bool } from 'yup';
import { create } from 'zustand';
import { Menu } from '../models/MenuModel';
import {
  createMenu,
  deleteMenu,
  getMenuById,
  getMenus,
  updateMenu
} from '../services/menuService';

interface MenuStore {
  menus: Menu[];
  loading: boolean;
  error: string | null;
  currentMenu: Menu | null;

  fetchMenus: (restaurantId?: number) => Promise<void>;
  fetchMenuById: (id: number) => Promise<void>;
  addMenu: (menuData: Omit<Menu, 'id' | 'created_at' | 'product' | 'restaurant'>) => Promise<void>;
  editMenu: (id: number, menuData: Partial<Menu>) => Promise<void>;
  removeMenu: (id: number) => Promise<void>;
  setCurrentMenu: (menu: Menu | null) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menus: [],
  loading: false,
  error: null,
  currentMenu: null,

  fetchMenus: async (restaurantId) => {
    set({ loading: true, error: null });
    try {
      const data = await getMenus(restaurantId);
      set({ menus: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar menús'
      });
    }
  },

  fetchMenuById: async (id) => {
    set({ loading: true, error: null });
    try {
      const menu = await getMenuById(id);
      //Cambiar availability que viene como string a boolean
  
      menu.availability = Boolean(menu.availability)
      
      set({ currentMenu: menu, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el menú'
      });
    }
  },

  setCurrentMenu: (menu) => set({ currentMenu: menu }),

  addMenu: async (menuData) => {
    set({ loading: true, error: null });
    try {
      const newMenu = await createMenu(menuData);
      set(state => ({
        menus: [...state.menus, newMenu],
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear menú'
      });
      throw error;
    }
  },

  editMenu: async (id, menuData) => {
    set({ loading: true, error: null });
    try {
      const updatedMenu = await updateMenu(id, menuData);
      set(state => ({
        menus: state.menus.map(menu => 
          menu.id === id ? updatedMenu : menu
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar menú'
      });
      throw error;
    }
  },

  removeMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteMenu(id);
      set(state => ({
        menus: state.menus.filter(menu => menu.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar menú'
      });
      throw error;
    }
  }
}));