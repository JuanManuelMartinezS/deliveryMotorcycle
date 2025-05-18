import { getAccessToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
// Función para decodificar correctamente los caracteres especiales
const decodeUnicode = (str: string): string => {
  try {
    // Primero intentamos parsear como JSON si viene con escapes
    if (/\\u[\dA-Fa-f]{4}/.test(str)) {
      return JSON.parse(`"${str}"`);
    }
    return str;
  } catch {
    return str;
  }
};
const handleApiError = async (response: Response): Promise<never> => {
  if (response.status === 401) {
    throw new Error('Sesión expirada, por favor vuelve a intentarlo');
  }

  let errorMessage = `Error ${response.status}: ${response.statusText}`;
  try {
    const errorData = await response.json();
 errorMessage = decodeUnicode(errorData.message) || errorMessage;
  } catch {
    // Si no podemos parsear el error como JSON, mantener el mensaje original
  }

  throw new Error(errorMessage);
};

export const sendChatMessage = async (context: string, userMessage: string): Promise<ReadableStream<string>> => {
  const token = await getAccessToken();
  const fullMessage = `${context}\n\nPregunta del usuario: ${userMessage}`;

  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: fullMessage }),
    credentials: 'include'
  });
console.log('Response:', response);

  if (!response.ok) {
    // Captura el error completo
    const errorData = await response.json().catch(() => ({}));
    console.error('Error completo:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.message || 'Error al enviar mensaje');
  }

  
  const reader = response.body?.getReader();

 return new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder('utf-8');
      try {
        let fullResponse = '';
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          
          fullResponse += decoder.decode(value, { stream: true });
          
          // Intenta parsear el JSON completo
          try {
            const parsedResponse = JSON.parse(fullResponse);
            if (parsedResponse.message) {
              // Envía solo el mensaje al stream
              controller.enqueue(parsedResponse.message);
              fullResponse = ''; // Reset para el próximo chunk si es necesario
            }
          } catch {
            // Si no se puede parsear, espera más chunks
            continue;
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    }
  });
};
export const uploadChatFile = async (file: File): Promise<{ fileUrl: string }> => {
  const token = await getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/chat/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    return handleApiError(response);
  }

  return response.json();
};
