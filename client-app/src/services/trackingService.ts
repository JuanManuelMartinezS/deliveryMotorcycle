// services/trackingService.ts
import { io, Socket } from 'socket.io-client';

// Asegurarnos de que la URL base esté definida
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


class TrackingService {
  private socket: Socket | null = null;
  private listeners: ((coords: { lat: number; lng: number }) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private currentPlate: string | null = null;

  connect(plate: string) {
    if (this.socket?.connected && this.currentPlate === plate) {
      console.log('Socket already connected for plate:', plate);
      return;
    }

    // Desconectar socket existente si hay uno
    if (this.socket) {
      this.disconnect();
    }

    this.currentPlate = plate;
    console.log('Connecting to Socket.IO server:', API_BASE_URL);

    // Usar Socket.IO con configuración específica
    this.socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000,
      path: '/socket.io',
      withCredentials: true,
      forceNew: true,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected successfully');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      if (reason === 'io server disconnect') {
        // El servidor cerró la conexión, intentar reconectar
        this.socket?.connect();
      }
    });

    // Escuchar eventos específicos de la placa
    this.socket.on(plate, (data) => {
      try {
        console.log('Received data for plate', plate, ':', data);
        if (data && typeof data === 'object' && 'lat' in data && 'lng' in data) {
          this.notifyListeners({ lat: data.lat, lng: data.lng });
        } else {
          console.warn('Received invalid coordinate data:', data);
        }
      } catch (error) {
        console.error('Error processing coordinate data:', error);
      }
    });

    // Intentar conectar explícitamente
    this.socket.connect();
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting Socket.IO');
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.currentPlate = null;
    }
  }

  addListener(listener: (coords: { lat: number; lng: number }) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (coords: { lat: number; lng: number }) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(coords: { lat: number; lng: number }) {
    this.listeners.forEach(listener => {
      try {
        listener(coords);
      } catch (error) {
        console.error('Error in coordinate listener:', error);
      }
    });
  }
}

export const trackingService = new TrackingService();