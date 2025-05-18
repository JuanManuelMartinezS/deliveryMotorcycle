// stores/useProductStore.ts
import { create } from 'zustand';
import {  getProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../services/productService';
import { Product } from '../models/ProductModel';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null;

  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  editProduct: (id: number, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
    // ... acciones existentes
  fetchProductById: (id: number) => Promise<void>;
  setCurrentProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar productos'
      });
    }
  },
 fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const product = await getProductById(id);
      set({ currentProduct: product, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el producto'
      });
    }
  },

  setCurrentProduct: (product: Product | null) => set({ currentProduct: product }),

  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await createProduct(productData);
      set(state => ({
        products: [...state.products, newProduct],
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear producto'
      });
      throw error;
    }
  },

  editProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await updateProduct(id, productData);
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar producto'
      });
      throw error;
    }
  },

  removeProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(id);
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar producto'
      });
      throw error;
    }
  }
}));