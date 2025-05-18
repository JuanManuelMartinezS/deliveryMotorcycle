import eventlet

eventlet.monkey_patch()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
import os
from flask_cors import CORS
from flask_socketio import SocketIO

db = SQLAlchemy()
socketio = SocketIO(
    cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
    async_mode="eventlet",
    logger=True,
    engineio_logger=True
)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configuración CORS global
    CORS(app, 
         resources={r"/*": {
             "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "expose_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "send_wildcard": False
         }},
         supports_credentials=True
    )

    db.init_app(app)
    socketio.init_app(app, 
                     cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
                     async_mode="eventlet")

    from app.presentation.routes import main_bp
    app.register_blueprint(main_bp)

    from app.business.models import restaurant, product, menu, customer, order, address
    from app.business.models import motorcycle, driver, shift, issue, photo

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')
    
    with app.app_context():
        db.create_all()

    return app
