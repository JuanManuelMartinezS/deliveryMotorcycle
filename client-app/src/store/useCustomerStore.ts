// stores/useCustomerStore.ts
import { create } from 'zustand';
import { Customer } from '../models/CustomerModel';
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer
} from '../services/CustomerService';

interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  currentCustomer: Customer | null;

  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  editCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
  removeCustomer: (id: number) => Promise<void>;
  fetchCustomerById: (id: number) => Promise<void>;
  setCurrentCustomer: (customer: Customer | null) => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  loading: false,
  error: null,
  currentCustomer: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCustomers();
      set({ customers: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar clientes'
      });
    }
  },

  fetchCustomerById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const customer = await getCustomerById(id);
     set({ currentCustomer: customer, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el cliente'
      });
    }
  },

  setCurrentCustomer: (customer: Customer | null) => set({ currentCustomer: customer }),

  addCustomer: async (customerData) => {
    set({ loading: true, error: null });
    try {
      const newCustomer = await createCustomer(customerData);
      set(state => ({
        customers: [...state.customers, newCustomer],
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear cliente'
      });
      throw error;
    }
  },

  editCustomer: async (id, customerData) => {
    set({ loading: true, error: null });
    try {
      const updatedCustomer = await updateCustomer(id, customerData);
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? updatedCustomer : customer
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar cliente'
      });
      throw error;
    }
  },

  removeCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCustomer(id);
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar cliente'
      });
      throw error;
    }
  }
}));