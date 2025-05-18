import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiImage, FiPaperclip, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { sendChatMessage, uploadChatFile } from '../../services/chatService';
import ChatAvatar from './ChatAvatar';

const APP_CONTEXT = `
Eres un asistente virtual inteligente integrado en una plataforma web desarrollada en React que gestiona domicilios realizados en motocicleta. Tu función principal es brindar ayuda contextual a los usuarios (restaurantes, clientes, repartidores y operadores logísticos) sobre cómo usar la aplicación correctamente.

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

Siempre responde de forma clara, amigable y útil. Estás disponible desde cualquier módulo del sistema.
`;

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; imageUrl?: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    console.log('FloatingChat mounted');
    // Inicializar la síntesis de voz
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      console.log('Speech synthesis initialized');
    } else {
      console.log('Speech synthesis not available');
    }
  }, []);

  const speakMessage = (text: string) => {
    console.log('Attempting to speak:', text);
    console.log('Is muted:', isMuted);
    console.log('Speech synthesis available:', !!speechSynthesisRef.current);

    if (!speechSynthesisRef.current || isMuted) {
      console.log('Speech synthesis not available or muted');
      return;
    }

    // Cancelar cualquier síntesis de voz en curso
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };
    utterance.onerror = (error) => {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    };

    speechSynthesisRef.current.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (speechSynthesisRef.current) {
      if (!isMuted) {
        speechSynthesisRef.current.cancel();
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFilePreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPEG, PNG, GIF)');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFilePreview = () => {
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() === '' && !filePreview) || isLoading) return;

    // Crear mensaje
    const userMessage = inputValue.trim();
    const newMessages = [...messages];

    if (filePreview) {
      newMessages.push({
        text: userMessage || '(Imagen)',
        isUser: true,
        imageUrl: filePreview
      });
    } else if (userMessage) {
      newMessages.push({ text: userMessage, isUser: true });
    }

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Subir archivo si existe
      let fileResponse: { fileUrl: string } | null = null;
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        fileResponse = await uploadChatFile(file) as { fileUrl: string };
        removeFilePreview();
      }

      // Enviar mensaje de texto
      if (userMessage || fileResponse) {
        const fullMessage = userMessage + (fileResponse ? `\n[Imagen: ${fileResponse.fileUrl}]` : '');

        setMessages(prev => [...prev, { text: "Escribiendo...", isUser: false }]);

        const responseStream = await sendChatMessage(APP_CONTEXT, fullMessage);
        const reader = responseStream.getReader();
        let assistantMessage = '';

        // Eliminar mensaje "Escribiendo..." temporal
        setMessages(prev => prev.slice(0, -1));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          assistantMessage += value;
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            
            if (!lastMessage || lastMessage.isUser) {
              return [...prev, { text: assistantMessage, isUser: false }];
            } else {
              return [...prev.slice(0, -1), { text: assistantMessage, isUser: false }];
            }
          });
        }

        // Reproducir el mensaje del asistente
        speakMessage(assistantMessage);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Error al enviar el mensaje. Intenta nuevamente.",
        isUser: false
      }]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {isOpen ? (
        <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-xl">Asistente Rappi</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-blue-500 transition-colors"
                  title={isMuted ? "Activar voz" : "Silenciar"}
                >
                  {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center -mb-8">
              <ChatAvatar isSpeaking={isSpeaking} />
            </div>
          </div>

          <div className="flex-1 p-4 pt-12 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center p-4">
                <p>Hola, soy el asistente de Rappi. ¿En qué puedo ayudarte?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {message.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={message.imageUrl}
                          alt="Imagen enviada"
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    )}
                    {message.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="bg-gray-100 text-gray-700 rounded-lg p-2 hover:bg-gray-200 transition-colors"
                title="Subir imagen"
              >
                <FiImage size={18} />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || (inputValue.trim() === '' && !filePreview)}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center relative ${
            messages.length > 0 ? 'animate-pulse' : ''
          }`}
          aria-label="Abrir chat"
        >
          <FiMessageSquare size={24} />
          {messages.length > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {messages.filter(m => m.isUser).length}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default FloatingChat;