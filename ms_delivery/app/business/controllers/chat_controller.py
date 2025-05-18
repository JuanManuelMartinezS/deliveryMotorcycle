import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

class ChatController:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialize_chat()
        return cls._instance
    
    def initialize_chat(self):
        """Inicializa la sesión de chat con Gemini"""
        # Configurar la API key
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        
        # Inicializar el modelo con gemini 2.0 flash lite

        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.chat_session = self.model.start_chat(history=[])
        self.history = []
        
        # Contexto del sistema
        self.system_context = """Eres un asistente virtual inteligente integrado en una plataforma web desarrollada en React que gestiona domicilios realizados en motocicleta. Tu función principal es brindar ayuda contextual a los usuarios (restaurantes, clientes, repartidores y operadores logísticos) sobre cómo usar la aplicación correctamente.

La plataforma tiene las siguientes funcionalidades clave:
- Autenticación mediante OAuth (Google, GitHub, Microsoft), mostrando el nombre y foto del usuario.
- Operaciones CRUD completas para:
  - Restaurantes (pueden ofrecer múltiples productos).
  - Productos gastronómicos.
  - Menús (relación entre restaurantes y productos).
  - Pedidos (realizados por clientes, contienen productos del menú).
  - Direcciones de entrega (una por pedido).
  - Motocicletas (cada una puede transportar múltiples pedidos y reportar inconvenientes).
  - Conductores (pueden usar diferentes motos en distintos turnos).
  - Inconvenientes (accidentes, fallas, etc., asociados a una moto con evidencia en imágenes).
  - Turnos (asocian conductores y motos con fecha/hora de inicio y fin).
- Visualización de motos en un mapa en tiempo real con Leaflet.
- Reportes visuales con gráficos (barras, circulares, líneas temporales) usando Recharts.
- Notificaciones visuales y sonoras cuando hay nuevos pedidos asignados.
- Formularios validados con Formik y Yup.
- Comunicación con backend por API REST, usando tokens de autenticación.

Actúa como un guía proactivo que:
- Responde preguntas frecuentes del sistema (ej. ¿cómo hacer un pedido?, ¿dónde registro un conductor?).
- Explica el propósito de cada módulo y su uso.
- Ayuda a navegar la aplicación con instrucciones claras.
- Puede brindar respuestas tanto funcionales como técnicas si es necesario.

Si el usuario escribe algo fuera del contexto de la aplicación, responde educadamente que solo puedes asistir dentro de la plataforma de domicilios.

Siempre responde de forma clara, amigable y útil. Estás disponible desde cualquier módulo del sistema."""
    
    def process_message(self, data):
        """Maneja la solicitud de chat"""
        if not data or 'message' not in data:
            return {'success': False, 'message': 'Mensaje no proporcionado'}
            
        user_message = data['message'].strip()
        if not user_message:
            return {'success': False, 'message': 'Mensaje vacío'}
        
        try: # Agregar mensaje al historial
            self.history.append({"role": "user", "content": user_message})
            # Limitar el historial a X mensajes
            MAX_HISTORY = 5
            if len(self.history) > MAX_HISTORY * 2:  # *2 por user/assistant
                self.history = self.history[-(MAX_HISTORY * 2):]
           
            
            # Obtener respuesta de Gemini
            response = self.chat_session.send_message(user_message)
            print("respuesta",response)
            full_response = response.text
            
            # Agregar respuesta al historial
            self.history.append({"role": "assistant", "content": full_response})
            
            return {
                'success': True,
                'message': full_response,
                'context': 'Rappi Delivery Assistant'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error en el servidor: {str(e)}'
            }

    def get_stream_response(self, message):
        """Generador para respuestas en streaming"""
        try:
            response = self.chat_session.send_message(message, stream=True)
            for chunk in response:
                yield chunk.text
        except Exception as e:
            yield f"Error: {str(e)}"

# Instancia singleton
chat_controller = ChatController()