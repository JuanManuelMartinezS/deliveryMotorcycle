import { create } from 'zustand';
import { Address } from '../models/AddressModel';
import {
    createAddress,
    deleteAddress,
    getAddressById,
    getAddresses,
    updateAddress
} from '../services/addressService';

interface AddressStore {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  currentAddress: Address | null;

  fetchAddresses: () => Promise<void>;
  fetchAddressById: (id: number) => Promise<void>;
  addAddress: (addressData: Omit<Address, 'id' | 'created_at'>) => Promise<Address>;
  editAddress: (id: number, addressData: Partial<Address>) => Promise<void>;
  removeAddress: (id: number) => Promise<void>;
  setCurrentAddress: (address: Address | null) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  loading: false,
  error: null,
  currentAddress: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAddresses();
      set({ addresses: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar direcciones'
      });
    }
  },

  fetchAddressById: async (id) => {
    set({ loading: true, error: null });
    try {
      const address = await getAddressById(id);
      set({ currentAddress: address, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar la dirección'
      });
    }
  },

  setCurrentAddress: (address) => set({ currentAddress: address }),

  addAddress: async (addressData) => {
    set({ loading: true, error: null });
    try {
      const newAddress = await createAddress(addressData);
      set(state => ({
        addresses: [...state.addresses, newAddress],
        loading: false
      }));
      return newAddress;
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear dirección'
      });
      throw error;
    }
  },

  editAddress: async (id, addressData) => {
    set({ loading: true, error: null });
    try {
      const updatedAddress = await updateAddress(id, addressData);
      set(state => ({
        addresses: state.addresses.map(address => 
          address.id === id ? updatedAddress : address
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar dirección'
      });
      throw error;
    }
  },

  removeAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteAddress(id);
      set(state => ({
        addresses: state.addresses.filter(address => address.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar dirección'
      });
      throw error;
    }
  }
}));