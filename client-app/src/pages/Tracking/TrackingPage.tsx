// pages/TrackingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrackingMap from '../../components/trackingMap';
import { getAccessToken } from '../../services/authService';
import { useTrackingStore } from '../../store/useTrackingStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TrackingPage: React.FC = () => {
  const { plate } = useParams<{ plate: string }>();
  const { startTracking, stopTracking, isTracking } = useTrackingStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plate) {
      setLoading(true);
      // Iniciar tracking en el backend
      fetch(`${API_BASE_URL}/motorcycles/track/${plate}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        startTracking(plate);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error starting tracking:', error);
        setLoading(false);
      });
    }

    return () => {
      if (plate) {
        // Detener tracking al salir de la página
        fetch(`${API_BASE_URL}/motorcycles/stop/${plate}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json'
          }
        });
        stopTracking();
      }
    };
  }, [plate, startTracking, stopTracking]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Seguimiento de Moto: {plate}</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-[500px]">
            <TrackingMap />
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Estado: {isTracking ? 'Activo' : 'Inactivo'}
          </div>
          <button
            onClick={stopTracking}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Detener Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;