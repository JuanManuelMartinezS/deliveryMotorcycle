# Configurar CORS para el blueprint
CORS(main_bp, 
     resources={r"/*": {
         "origins": ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5173"],
         "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "Accept"],
         "supports_credentials": True,
         "expose_headers": ["Content-Type", "Authorization"],
         "max_age": 3600,
         "send_wildcard": False
     }},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept"],
     expose_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
) 