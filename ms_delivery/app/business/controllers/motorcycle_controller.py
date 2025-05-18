from app import db,socketio
from app.business.models.motorcycle import Motorcycle
from flask import jsonify
import json
import eventlet
import math

# Carga las coordenadas una vez y elimina duplicados
with open("coordinates/routes/example_1.json", "r") as f:
    coordenadas_raw = json.load(f)
    # Eliminar coordenadas duplicadas consecutivas
    coordenadas = []
    for i, coord in enumerate(coordenadas_raw):
        if i == 0 or (coord['lat'] != coordenadas_raw[i-1]['lat'] or coord['lng'] != coordenadas_raw[i-1]['lng']):
            coordenadas.append(coord)

# Control de tareas activas por placa
tareas_activas = {}

def calcular_distancia(coord1, coord2):
    """Calcula la distancia entre dos coordenadas en metros"""
    R = 6371000  # Radio de la Tierra en metros
    lat1, lon1 = math.radians(coord1['lat']), math.radians(coord1['lng'])
    lat2, lon2 = math.radians(coord2['lat']), math.radians(coord2['lng'])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

class MotorcycleController:
    @staticmethod
    def get_all():
        motorcycles = Motorcycle.query.all()
        return [motorcycle.to_dict() for motorcycle in motorcycles]
    
    @staticmethod
    def get_by_id(motorcycle_id):
        motorcycle = Motorcycle.query.get_or_404(motorcycle_id)
        return motorcycle.to_dict()
    
    @staticmethod
    def create(data):
        new_motorcycle = Motorcycle(
            license_plate=data.get('license_plate'),
            brand=data.get('brand'),
            year=data.get('year'),
            status=data.get('status', 'available')
        )
        
        db.session.add(new_motorcycle)
        db.session.commit()
        
        return new_motorcycle.to_dict(), 201
    
    @staticmethod
    def update(motorcycle_id, data):
        motorcycle = Motorcycle.query.get_or_404(motorcycle_id)
        
        if 'license_plate' in data:
            motorcycle.license_plate = data['license_plate']
        if 'brand' in data:
            motorcycle.brand = data['brand']
        if 'year' in data:
            motorcycle.year = data['year']
        if 'status' in data:
            motorcycle.status = data['status']
        
        db.session.commit()
        
        return motorcycle.to_dict()
    
    @staticmethod
    def delete(motorcycle_id):
        motorcycle = Motorcycle.query.get_or_404(motorcycle_id)
        
        db.session.delete(motorcycle)
        db.session.commit()
        
        return {"message": "Motorcycle deleted successfully"}, 200



    @staticmethod
    def start_tracking_by_plate(plate):
        motorcycle = Motorcycle.query.filter_by(license_plate=plate).first()
        if not motorcycle:
            return {"status": "error", "message": "Motocicleta no encontrada"}, 404

        if plate in tareas_activas:
            return {"status": "ok", "message": f"Transmisión ya activa para {plate}"}

        # Inicia la transmisión de coordenadas en segundo plano
        socketio.start_background_task(MotorcycleController._emit_coordinates, plate)
        tareas_activas[plate] = True
        return {"status": "ok", "message": f"Transmisión iniciada para {plate}"}

    @staticmethod
    def _emit_coordinates(plate):
        i = 0
        total = len(coordenadas)
        ultima_coord = None
        umbral_distancia = 5  # metros

        while tareas_activas.get(plate, False):
            coord = coordenadas[i]
            
            # Solo emitir si la distancia es significativa
            if ultima_coord is None or calcular_distancia(ultima_coord, coord) >= umbral_distancia:
                socketio.emit(plate, coord)
                print(f"[{plate}] Emitiendo coordenada {i}: {coord}")
                ultima_coord = coord
            
            i = (i + 1) % total
            eventlet.sleep(3)

    @staticmethod
    def stop_tracking_by_plate(plate):
        if plate in tareas_activas:
            tareas_activas[plate] = False
            tareas_activas.pop(plate, None)  # Limpieza
            return {"status": "ok", "message": f"Transmisión detenida para {plate}"}
        else:
            return {"status": "error", "message": f"No hay transmisión activa para {plate}"}, 404