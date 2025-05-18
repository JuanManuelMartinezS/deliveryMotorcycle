// components/TrackingMap.tsx
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useTrackingStore } from '../store/useTrackingStore';

// Icono personalizado
const motorcycleIcon = new L.Icon({
  iconUrl: '/motorcycle-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Componente para mover el mapa al cambiar la posición
const MapFlyTo: React.FC<{ position: L.LatLngExpression }> = ({ position }) => {
  const map = useMap();
  const lastPosition = useRef(position);
  const lastUpdateTime = useRef(Date.now());
  const MIN_UPDATE_INTERVAL = 1000; // 1 segundo entre actualizaciones
  const MIN_DISTANCE = 0.0001; // Aproximadamente 10 metros

  useEffect(() => {
    if (!position) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;
    
    // Calcular distancia entre la última posición y la nueva
    const lastLatLng = L.latLng(lastPosition.current);
    const newLatLng = L.latLng(position);
    const distance = lastLatLng.distanceTo(newLatLng);

    // Solo actualizar si ha pasado suficiente tiempo y la distancia es significativa
    if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL && distance >= MIN_DISTANCE) {
      console.log('Flying to position:', position, 'Distance:', distance);
      map.flyTo(position, 16, {
        duration: 2,
        easeLinearity: 0.5,
        noMoveStart: true
      });
      lastPosition.current = position;
      lastUpdateTime.current = now;
    }
  }, [position, map]);

  return null;
};

const TrackingMap: React.FC = () => {
  const { currentPosition, isTracking } = useTrackingStore();

  if (!isTracking) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">Esperando inicio de seguimiento...</p>
      </div>
    );
  }

  // Coordenadas iniciales (Manizales)
  const initialPosition: [number, number] = [5.0689, -75.5174];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={currentPosition || initialPosition}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenCreated={(map) => {
          // Centrar el mapa en la posición inicial
          if (!currentPosition) {
            map.flyTo(initialPosition, 16, {
              duration: 2,
              easeLinearity: 0.5
            });
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {currentPosition && (
          <>
            <MapFlyTo position={currentPosition} />
            <Marker 
              position={currentPosition} 
              icon={motorcycleIcon}
              zIndexOffset={1000} // Asegurar que el marcador esté siempre visible
            >
              <Popup>
                <div className="text-center">
                  <strong>Moto en movimiento</strong>
                  <br />
                  Lat: {currentPosition.lat.toFixed(6)}
                  <br />
                  Lng: {currentPosition.lng.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
