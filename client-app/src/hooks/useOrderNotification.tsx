import { useCallback, useState } from 'react';
import { useNotification } from './useNotification';
import { useNotificationStore } from '../store/useNotificationStore';

export const useOrderNotification = () => {
  const { showNotification } = useNotification();
  const { addNotification } = useNotificationStore();
  const [audio] = useState(new Audio('/notification-sound.mp3'));

  // Función para reproducir el sonido de notificación
  const playNotificationSound = useCallback(() => {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  }, [audio]);

  // Función para mostrar una notificación de nuevo pedido
  const notifyNewOrder = useCallback((orderId: number, message: string) => {
    // Agregar la notificación al store global
    addNotification({
      orderId,
      message,
      timestamp: Date.now()
    });

    // Reproducir sonido
    playNotificationSound();

    // Mostrar notificación temporal
    showNotification(message, 'info');
  }, [addNotification, playNotificationSound, showNotification]);

  return {
    notifyNewOrder
  };
}; 