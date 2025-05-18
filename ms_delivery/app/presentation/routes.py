from flask import Blueprint, json, jsonify, request
from flask_cors import CORS
from app.business.controllers.restaurant_controller import RestaurantController
from app.business.controllers.product_controller import ProductController
from app.business.controllers.menu_controller import MenuController
from app.business.controllers.customer_controller import CustomerController
from app.business.controllers.order_controller import OrderController
from app.business.controllers.address_controller import AddressController
from app.business.controllers.motorcycle_controller import MotorcycleController
from app.business.controllers.driver_controller import DriverController
from app.business.controllers.shift_controller import ShiftController
from app.business.controllers.issue_controller import IssueController
from app.business.controllers.photo_controller import PhotoController
from flask import Flask, send_from_directory
import os
from flask import send_file, abort,send_from_directory
from flask import current_app
from flask import Response, stream_with_context
from app.business.controllers.chat_controller import chat_controller
main_bp = Blueprint('main', __name__)

# Configurar CORS para el blueprint
CORS(main_bp, 
     resources={r"/*": {
         "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "expose_headers": ["Content-Type", "Authorization"],
         "max_age": 3600
     }},
     supports_credentials=True
)

# Restaurant routes
@main_bp.route('/restaurants', methods=['GET'])
def get_restaurants():
    return jsonify(RestaurantController.get_all())

@main_bp.route('/restaurants/<int:id>', methods=['GET'])
def get_restaurant(id):
    return jsonify(RestaurantController.get_by_id(id))

@main_bp.route('/restaurants', methods=['POST'])
def create_restaurant():
    return jsonify(RestaurantController.create(request.json))

@main_bp.route('/restaurants/<int:id>', methods=['PUT'])
def update_restaurant(id):
    return jsonify(RestaurantController.update(id, request.json))

@main_bp.route('/restaurants/<int:id>', methods=['DELETE'])
def delete_restaurant(id):
    return jsonify(RestaurantController.delete(id))


# Product routes
@main_bp.route('/products', methods=['GET'])
def get_products():
    return jsonify(ProductController.get_all())

@main_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    return jsonify(ProductController.get_by_id(id))

@main_bp.route('/products', methods=['POST'])
def create_product():
    return jsonify(ProductController.create(request.json))

@main_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    return jsonify(ProductController.update(id, request.json))

@main_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    return jsonify(ProductController.delete(id))

# Menu routes
@main_bp.route('/menus', methods=['GET'])
def get_menus():
    return jsonify(MenuController.get_all())

@main_bp.route('/menus/<int:id>', methods=['GET'])
def get_menu(id):
    return jsonify(MenuController.get_by_id(id))

@main_bp.route('/menus', methods=['POST'])
def create_menu():
    return jsonify(MenuController.create(request.json))

@main_bp.route('/menus/<int:id>', methods=['PUT'])
def update_menu(id):
    return jsonify(MenuController.update(id, request.json))

@main_bp.route('/menus/<int:id>', methods=['DELETE'])
def delete_menu(id):
    return jsonify(MenuController.delete(id))

@main_bp.route('/restaurants/<int:restaurant_id>/menus', methods=['GET'])
def get_restaurant_menus(restaurant_id):
    return jsonify(MenuController.get_by_restaurant_id(restaurant_id))

# Customer routes
@main_bp.route('/customers', methods=['GET'])
def get_customers():
    return jsonify(CustomerController.get_all())

@main_bp.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    return jsonify(CustomerController.get_by_id(id))

@main_bp.route('/customers', methods=['POST'])
def create_customer():
    return jsonify(CustomerController.create(request.json))

@main_bp.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    return jsonify(CustomerController.update(id, request.json))

@main_bp.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    return jsonify(CustomerController.delete(id))

# Order routes
@main_bp.route('/orders', methods=['GET'])
def get_orders():
    return jsonify(OrderController.get_all())

@main_bp.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    return jsonify(OrderController.get_by_id(id))

@main_bp.route('/orders', methods=['POST'])
def create_order():
    return jsonify(OrderController.create(request.json))

@main_bp.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    return jsonify(OrderController.update(id, request.json))

@main_bp.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    return jsonify(OrderController.delete(id))

@main_bp.route('/orders/<int:id>/status', methods=['PATCH', 'OPTIONS'])
def update_order_status(id):
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify(OrderController.update(id, request.json))

@main_bp.route('/customers/<int:customer_id>/orders', methods=['GET'])
def get_customer_orders(customer_id):
    return jsonify(OrderController.get_by_customer_id(customer_id))

# Address routes
@main_bp.route('/addresses', methods=['GET'])
def get_addresses():
    return jsonify(AddressController.get_all())

@main_bp.route('/addresses/<int:id>', methods=['GET'])
def get_address(id):
    return jsonify(AddressController.get_by_id(id))

@main_bp.route('/addresses', methods=['POST'])
def create_address():
    return jsonify(AddressController.create(request.json))

@main_bp.route('/addresses/<int:id>', methods=['PUT'])
def update_address(id):
    return jsonify(AddressController.update(id, request.json))

@main_bp.route('/addresses/<int:id>', methods=['DELETE'])
def delete_address(id):
    return jsonify(AddressController.delete(id))

# Motorcycle routes
@main_bp.route('/motorcycles', methods=['GET'])
def get_motorcycles():
    return jsonify(MotorcycleController.get_all())

@main_bp.route('/motorcycles/<int:id>', methods=['GET'])
def get_motorcycle(id):
    return jsonify(MotorcycleController.get_by_id(id))

@main_bp.route('/motorcycles', methods=['POST'])
def create_motorcycle():
    return jsonify(MotorcycleController.create(request.json))

@main_bp.route('/motorcycles/<int:id>', methods=['PUT'])
def update_motorcycle(id):
    return jsonify(MotorcycleController.update(id, request.json))

@main_bp.route('/motorcycles/<int:id>', methods=['DELETE'])
def delete_motorcycle(id):
    return jsonify(MotorcycleController.delete(id))

# Driver routes
@main_bp.route('/drivers', methods=['GET'])
def get_drivers():
    return jsonify(DriverController.get_all())

@main_bp.route('/drivers/<int:id>', methods=['GET'])
def get_driver(id):
    return jsonify(DriverController.get_by_id(id))

@main_bp.route('/drivers', methods=['POST'])
def create_driver():
    return jsonify(DriverController.create(request.json))

@main_bp.route('/drivers/<int:id>', methods=['PUT'])
def update_driver(id):
    return jsonify(DriverController.update(id, request.json))

@main_bp.route('/drivers/<int:id>', methods=['DELETE'])
def delete_driver(id):
    return jsonify(DriverController.delete(id))

# Shift routes
@main_bp.route('/shifts', methods=['GET'])
def get_shifts():
    return jsonify(ShiftController.get_all())

@main_bp.route('/shifts/<int:id>', methods=['GET'])
def get_shift(id):
    return jsonify(ShiftController.get_by_id(id))

@main_bp.route('/shifts', methods=['POST'])
def create_shift():
    return jsonify(ShiftController.create(request.json))

@main_bp.route('/shifts/<int:id>', methods=['PUT'])
def update_shift(id):
    return jsonify(ShiftController.update(id, request.json))

@main_bp.route('/shifts/<int:id>', methods=['DELETE'])
def delete_shift(id):
    return jsonify(ShiftController.delete(id))

@main_bp.route('/drivers/<int:driver_id>/shifts', methods=['GET'])
def get_driver_shifts(driver_id):
    return jsonify(ShiftController.get_by_driver_id(driver_id))

@main_bp.route('/motorcycles/<int:motorcycle_id>/shifts', methods=['GET'])
def get_motorcycle_shifts(motorcycle_id):
    return jsonify(ShiftController.get_by_motorcycle_id(motorcycle_id))

# Issue routes
@main_bp.route('/issues', methods=['GET'])
def get_issues():
    return jsonify(IssueController.get_all())

@main_bp.route('/issues/<int:id>', methods=['GET'])
def get_issue(id):
    return jsonify(IssueController.get_by_id(id))

@main_bp.route('/issues', methods=['POST'])
def create_issue():
    return jsonify(IssueController.create(request.json))

@main_bp.route('/issues/<int:id>', methods=['PUT'])
def update_issue(id):
    return jsonify(IssueController.update(id, request.json))

@main_bp.route('/issues/<int:id>', methods=['DELETE'])
def delete_issue(id):
    return jsonify(IssueController.delete(id))

@main_bp.route('/motorcycles/<int:motorcycle_id>/issues', methods=['GET'])
def get_motorcycle_issues(motorcycle_id):
    return jsonify(IssueController.get_by_motorcycle_id(motorcycle_id))

# Photo routes
@main_bp.route('/photos', methods=['GET'])
def get_photos():
    return jsonify(PhotoController.get_all())

@main_bp.route('/photos/<int:id>', methods=['GET'])
def get_photo(id):
    return PhotoController.get_by_id(id)

@main_bp.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    image_path = os.path.join(current_app.root_path+"/uploads", filename)
    print(image_path)
    if os.path.isfile(image_path):
        return send_file(image_path, mimetype='image/png')

@main_bp.route('/photos', methods=['POST'])
def create_photo():
    return jsonify(PhotoController.create(request.json))

@main_bp.route('/photos/<int:id>', methods=['PUT'])
def update_photo(id):
    return jsonify(PhotoController.update(id, request.json))

@main_bp.route('/photos/<int:id>', methods=['DELETE'])
def delete_photo(id):
    return jsonify(PhotoController.delete(id))

############## Carga imágenes

@main_bp.route('/photos/upload', methods=['POST'])
def upload_photo():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    data = request.form.to_dict()
    return jsonify(PhotoController.create_with_file(data, file))

##########Socket
@main_bp.route("/motorcycles/track/<plate>", methods=["POST"])
def start_tracking(plate):
    result = MotorcycleController.start_tracking_by_plate(plate)
    return jsonify(result)
@main_bp.route("/motorcycles/stop/<plate>", methods=["POST"])
def stop_tracking(plate):
    result = MotorcycleController.stop_tracking_by_plate(plate)
    return jsonify(result)

@main_bp.route('/chat/message', methods=['POST', 'OPTIONS'])
def send_chat_message():
    if request.method == 'OPTIONS':
        return '', 200
        
    if not request.is_json:
        return jsonify({"success": False, "message": "Solo se acepta JSON"}), 400
    
    data = request.get_json()
    return jsonify(chat_controller.process_message(data))

@main_bp.route('/chat/stream', methods=['GET'])
def chat_stream():
    def generate():
        # Obtener el último mensaje del usuario del historial
        last_user_message = ""
        for msg in reversed(chat_controller.history):
            if msg["role"] == "user":
                last_user_message = msg["content"]
                break
        
        if not last_user_message:
            yield "data: No hay mensajes recientes\n\n"
            return
        
        # Stream de respuesta
        for chunk in chat_controller.get_stream_response(last_user_message):
            yield f"data: {chunk}\n\n"
    
    return Response(generate(), mimetype="text/event-stream")

@main_bp.route('/avatar/stream', methods=['GET'])
def avatar_stream():
    def generate():
        try:
            # Obtener mensaje del contexto
            last_message = chat_controller.get_last_user_message()
            
            # Stream de respuesta con sincronización para animación
            for chunk in chat_controller.get_stream_response(last_message):
                # Formato especial para sincronizar con animación
                data = {
                    "texto": chunk.text,
                    "duracion": len(chunk.text) * 0.05,  # Estimación tiempo habla
                    "emocion": "neutral"  # Puedes cambiar según análisis de sentimiento
                }
                yield f"data: {json.dumps(data)}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return Response(stream_with_context(generate()), mimetype="text/event-stream")

@main_bp.route('/chat/upload', methods=['POST'])
def upload_chat_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        # Procesar imagen con Gemini
        response = chat_controller.process_image(file)
        return jsonify({
            'success': True,
            'message': response
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500