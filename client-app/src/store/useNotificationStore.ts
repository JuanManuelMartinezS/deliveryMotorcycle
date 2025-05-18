// stores/TS useNotificationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: number;
  orderId: number;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: number) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const id = Date.now();
        const newNotification: Notification = {
          ...notification,
          id,
          read: false
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: state.notifications.filter((n) => !n.read && n.id !== id).length
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true
          })),
          unreadCount: 0
        }));
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.notifications.filter((n) => !n.read && n.id !== id).length
        }));
      }
    }),
    {
      name: 'notifications-storage'
    }
  )
);