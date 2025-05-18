import { create } from 'zustand';
import { Order, OrderStatus } from '../models/OrderModel';
import {
    createOrder,
    deleteOrder,
    getOrderById,
    getOrders,
    updateOrder,
    updateOrderStatus
} from '../services/orderService';

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;

  fetchOrders: (customerId?: number) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  addOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'customer' | 'menu' | 'address'>) => Promise<Order>;
  editOrder: (id: number, orderData: Partial<Order>) => Promise<void>;
  removeOrder: (id: number) => Promise<void>;
  changeOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,

  fetchOrders: async (customerId) => {
    set({ loading: true, error: null });
    try {
      const data = await getOrders(customerId);
      set({ orders: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar órdenes'
      });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const order = await getOrderById(id);
      set({ currentOrder: order, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar la orden'
      });
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),

  addOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const newOrder = await createOrder(orderData);
      set(state => ({
        orders: [...state.orders, newOrder],
        loading: false
      }));
      return newOrder;
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear orden'
      });
      throw error;
    }
  },

  editOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await updateOrder(id, orderData);
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? updatedOrder : order
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar orden'
      });
      throw error;
    }
  },

  changeOrderStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await updateOrderStatus(id, status);
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar estado de la orden'
      });
      throw error;
    }
  },

  removeOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteOrder(id);
      set(state => ({
        orders: state.orders.filter(order => order.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar orden'
      });
      throw error;
    }
  }
}));